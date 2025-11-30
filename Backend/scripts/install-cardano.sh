#!/bin/bash

# Install Cardano CLI and Node
# This script downloads and installs the latest Cardano tools

set -e

echo "🔧 Installing Cardano CLI and Node..."

# Create temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Download latest Cardano node
echo "📥 Downloading Cardano node..."
CARDANO_VERSION="8.7.3"
wget -q "https://github.com/IntersectMBO/cardano-node/releases/download/${CARDANO_VERSION}/cardano-node-${CARDANO_VERSION}-linux.tar.gz"

# Extract
echo "📦 Extracting..."
tar -xzf "cardano-node-${CARDANO_VERSION}-linux.tar.gz"

# Install to user bin
mkdir -p ~/.local/bin
mv bin/cardano-node ~/.local/bin/
mv bin/cardano-cli ~/.local/bin/

# Add to PATH if not already there
if ! grep -q "$HOME/.local/bin" ~/.bashrc; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi

# Cleanup
cd -
rm -rf "$TEMP_DIR"

echo "✅ Cardano CLI and Node installed!"
echo ""
echo "Verify installation:"
echo "  ~/.local/bin/cardano-cli --version"
echo "  ~/.local/bin/cardano-node --version"
echo ""
echo "Add to PATH: source ~/.bashrc"
