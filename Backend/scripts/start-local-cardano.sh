#!/bin/bash

# Quick Start Local Cardano Development Environment

echo "🚀 Starting Local Cardano Development Environment"
echo "=================================================="
echo ""

# Start Yaci DevKit
echo "📦 Starting Yaci DevKit (Local Cardano)..."
docker-compose -f docker-compose.local-blockchain.yml up -d yaci-devkit

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if running
if curl -s http://localhost:8080/api/v1/epochs/latest > /dev/null 2>&1; then
    echo "✅ Yaci DevKit is running!"
else
    echo "⏳ Still starting up... (this may take a minute)"
    sleep 20
fi

echo ""
echo "=================================================="
echo "✅ Local Cardano Environment Ready!"
echo "=================================================="
echo ""
echo "🌐 Access Points:"
echo "  • Explorer:  http://localhost:8080"
echo "  • API:       http://localhost:8080/api/v1"
echo "  • Node:      localhost:3001"
echo ""
echo "💰 Pre-funded Demo Wallets:"
echo "  Check: http://localhost:8080/api/v1/addresses"
echo ""
echo "🧪 Quick Test:"
echo "  curl http://localhost:8080/api/v1/epochs/latest"
echo ""
echo "📝 Logs:"
echo "  docker logs -f cardano-local"
echo ""
echo "🛑 Stop:"
echo "  docker-compose -f docker-compose.local-blockchain.yml down"
echo ""
echo "=================================================="
