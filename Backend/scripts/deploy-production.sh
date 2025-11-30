#!/bin/bash

#############################################
# DecentralAI Analytics - Production Deployment
# Deploys to production environment
#############################################

set -e

echo "🚀 DecentralAI Analytics - Production Deployment"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Safety check
echo -e "${RED}⚠️  WARNING: This will deploy to PRODUCTION!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no) " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Check environment
if [ -z "$DEPLOY_ENV" ]; then
    export DEPLOY_ENV="production"
fi

print_info "Deployment environment: $DEPLOY_ENV"

# Pre-deployment checks
echo ""
echo "📋 Running pre-deployment checks..."

# Check if required tools are installed
REQUIRED_TOOLS=("docker" "kubectl" "git")
for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! command -v $tool &> /dev/null; then
        print_error "$tool is not installed!"
        exit 1
    fi
done
print_status "All required tools are installed"

# Check Git status
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes!"
    read -p "Continue anyway? (yes/no) " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        exit 0
    fi
fi

# Get current Git commit
GIT_COMMIT=$(git rev-parse --short HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_status "Git commit: $GIT_COMMIT (branch: $GIT_BRANCH)"

# Run tests
echo ""
echo "🧪 Running tests..."
if ./scripts/test-all.sh; then
    print_status "All tests passed"
else
    print_error "Tests failed! Deployment aborted."
    exit 1
fi

# Build Docker images
echo ""
echo "🐳 Building production Docker images..."

DOCKER_REGISTRY="${DOCKER_REGISTRY:-registry.decentralai.io}"
IMAGE_TAG="${IMAGE_TAG:-$GIT_COMMIT}"

# Build backend API
print_info "Building backend-api image..."
docker build -t $DOCKER_REGISTRY/backend-api:$IMAGE_TAG \
    -t $DOCKER_REGISTRY/backend-api:latest \
    -f packages/backend-api/Dockerfile .

# Build agent company
print_info "Building agent-company image..."
docker build -t $DOCKER_REGISTRY/agent-company:$IMAGE_TAG \
    -t $DOCKER_REGISTRY/agent-company:latest \
    -f packages/agent-company/Dockerfile .

print_status "Docker images built successfully"

# Push to registry
echo ""
read -p "Push images to registry? (yes/no) " -r
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "📤 Pushing images to registry..."
    
    docker push $DOCKER_REGISTRY/backend-api:$IMAGE_TAG
    docker push $DOCKER_REGISTRY/backend-api:latest
    
    docker push $DOCKER_REGISTRY/agent-company:$IMAGE_TAG
    docker push $DOCKER_REGISTRY/agent-company:latest
    
    print_status "Images pushed to registry"
fi

# Deploy to Kubernetes
echo ""
read -p "Deploy to Kubernetes? (yes/no) " -r
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "☸️  Deploying to Kubernetes..."
    
    # Check kubectl context
    CURRENT_CONTEXT=$(kubectl config current-context)
    print_warning "Current kubectl context: $CURRENT_CONTEXT"
    read -p "Is this correct? (yes/no) " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Please switch to correct context and try again."
        exit 0
    fi
    
    # Apply Kubernetes manifests
    if [ -d "k8s" ]; then
        print_info "Applying Kubernetes manifests..."
        
        # Create namespace if it doesn't exist
        kubectl create namespace decentralai --dry-run=client -o yaml | kubectl apply -f -
        
        # Apply ConfigMaps and Secrets
        if [ -f "k8s/configmap.yaml" ]; then
            kubectl apply -f k8s/configmap.yaml -n decentralai
        fi
        
        if [ -f "k8s/secrets.yaml" ]; then
            kubectl apply -f k8s/secrets.yaml -n decentralai
        fi
        
        # Apply deployments
        kubectl apply -f k8s/ -n decentralai
        
        # Update image tags
        kubectl set image deployment/backend-api \
            backend-api=$DOCKER_REGISTRY/backend-api:$IMAGE_TAG \
            -n decentralai
        
        kubectl set image deployment/agent-company \
            agent-company=$DOCKER_REGISTRY/agent-company:$IMAGE_TAG \
            -n decentralai
        
        print_status "Kubernetes manifests applied"
        
        # Wait for rollout
        echo ""
        print_info "Waiting for rollout to complete..."
        kubectl rollout status deployment/backend-api -n decentralai --timeout=5m
        kubectl rollout status deployment/agent-company -n decentralai --timeout=5m
        
        print_status "Deployment completed successfully"
    else
        print_warning "k8s directory not found. Skipping Kubernetes deployment."
    fi
fi

# Run smoke tests
echo ""
read -p "Run smoke tests? (yes/no) " -r
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "🔥 Running smoke tests..."
    
    # Get service URL
    if command -v kubectl &> /dev/null; then
        SERVICE_URL=$(kubectl get svc backend-api -n decentralai -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "localhost:3000")
    else
        SERVICE_URL="localhost:3000"
    fi
    
    # Test health endpoint
    if curl -f -s http://$SERVICE_URL/health > /dev/null; then
        print_status "Health check passed"
    else
        print_error "Health check failed!"
        exit 1
    fi
    
    # Test metrics endpoint
    if curl -f -s http://$SERVICE_URL/metrics > /dev/null; then
        print_status "Metrics endpoint accessible"
    else
        print_warning "Metrics endpoint not accessible"
    fi
    
    print_status "Smoke tests completed"
fi

# Create deployment record
echo ""
print_info "Creating deployment record..."
DEPLOYMENT_LOG="deployments/deployment-$(date +%Y%m%d-%H%M%S).log"
mkdir -p deployments

cat > $DEPLOYMENT_LOG << EOF
Deployment Record
=================
Date: $(date)
Environment: $DEPLOY_ENV
Git Commit: $GIT_COMMIT
Git Branch: $GIT_BRANCH
Image Tag: $IMAGE_TAG
Registry: $DOCKER_REGISTRY
Deployed By: $(whoami)
Kubernetes Context: $(kubectl config current-context 2>/dev/null || echo "N/A")

Deployment Status: SUCCESS
EOF

print_status "Deployment record created: $DEPLOYMENT_LOG"

# Display summary
echo ""
echo "================================================"
echo "✅ Production Deployment Completed!"
echo "================================================"
echo ""
echo "📊 Deployment Summary:"
echo "  • Environment:      $DEPLOY_ENV"
echo "  • Git Commit:       $GIT_COMMIT"
echo "  • Image Tag:        $IMAGE_TAG"
echo "  • Registry:         $DOCKER_REGISTRY"
echo ""
echo "🔍 Post-Deployment Steps:"
echo "  1. Monitor logs:    kubectl logs -f deployment/backend-api -n decentralai"
echo "  2. Check metrics:   curl http://$SERVICE_URL/metrics"
echo "  3. Verify health:   curl http://$SERVICE_URL/health"
echo "  4. Run tests:       ./scripts/test-production.sh"
echo ""
echo "📚 Documentation:"
echo "  • Deployment log:   $DEPLOYMENT_LOG"
echo "  • Rollback:         kubectl rollout undo deployment/backend-api -n decentralai"
echo ""
echo "🎉 Deployment successful!"
echo ""
