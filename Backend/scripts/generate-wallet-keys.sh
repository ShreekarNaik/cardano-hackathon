#!/bin/bash

# Generate Cardano Wallet Keys
# Creates payment and stake keys for testnet

set -e

CARDANO_DIR="$HOME/cardano/preprod"
mkdir -p "$CARDANO_DIR"
cd "$CARDANO_DIR"

echo "🔑 Generating Cardano Wallet Keys..."
echo ""

# Use cardano-cli from PATH or local bin
CARDANO_CLI="cardano-cli"
if [ -f "$HOME/.local/bin/cardano-cli" ]; then
    CARDANO_CLI="$HOME/.local/bin/cardano-cli"
fi

# Generate payment keys
if [ ! -f payment.skey ]; then
    echo "📝 Generating payment keys..."
    $CARDANO_CLI address key-gen \
        --verification-key-file payment.vkey \
        --signing-key-file payment.skey
    echo "✅ Payment keys generated"
else
    echo "✅ Payment keys already exist"
fi

# Generate stake keys
if [ ! -f stake.skey ]; then
    echo "📝 Generating stake keys..."
    $CARDANO_CLI stake-address key-gen \
        --verification-key-file stake.vkey \
        --signing-key-file stake.skey
    echo "✅ Stake keys generated"
else
    echo "✅ Stake keys already exist"
fi

# Build payment address
if [ ! -f payment.addr ]; then
    echo "📝 Building payment address..."
    $CARDANO_CLI address build \
        --payment-verification-key-file payment.vkey \
        --stake-verification-key-file stake.vkey \
        --out-file payment.addr \
        --testnet-magic 1
    echo "✅ Payment address created"
else
    echo "✅ Payment address already exists"
fi

echo ""
echo "=================================="
echo "✅ Wallet Setup Complete!"
echo "=================================="
echo ""
echo "Your Cardano Preprod Testnet Address:"
echo "$(cat payment.addr)"
echo ""
echo "Files created in: $CARDANO_DIR"
echo "  • payment.skey (signing key - KEEP SECRET!)"
echo "  • payment.vkey (verification key)"
echo "  • stake.skey (stake signing key)"
echo "  • stake.vkey (stake verification key)"
echo "  • payment.addr (your testnet address)"
echo ""
echo "⚠️  IMPORTANT: Backup these keys securely!"
echo ""
echo "Next step: Get test ADA from faucet"
echo "  Address to use: $(cat payment.addr)"
echo ""
