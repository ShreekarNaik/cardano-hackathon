#!/bin/bash

# Setup Cardano Preprod Testnet Wallets
# This script generates payment and stake keys for Cardano preprod testnet

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WALLET_DIR="$PROJECT_ROOT/wallets/preprod/cardano"

echo "🔑 Setting up Cardano Preprod Testnet Wallets..."
echo "Wallet directory: $WALLET_DIR"

# Create wallet directory if it doesn't exist
mkdir -p "$WALLET_DIR"

# Use Docker to run cardano-cli (official IOG image in CLI mode)
CARDANO_CLI="docker run --rm -v $WALLET_DIR:/keys ghcr.io/intersectmbo/cardano-node:latest cli"

# Network magic for preprod testnet
TESTNET_MAGIC=1

echo ""
echo "📝 Generating payment key pair..."
$CARDANO_CLI address key-gen \
    --verification-key-file /keys/payment.vkey \
    --signing-key-file /keys/payment.skey

echo "✅ Payment keys generated"

echo ""
echo "📝 Generating stake key pair..."
$CARDANO_CLI latest stake-address key-gen \
    --verification-key-file /keys/stake.vkey \
    --signing-key-file /keys/stake.skey

echo "✅ Stake keys generated"

echo ""
echo "📝 Building payment address..."
$CARDANO_CLI latest address build \
    --payment-verification-key-file /keys/payment.vkey \
    --stake-verification-key-file /keys/stake.vkey \
    --out-file /keys/payment.addr \
    --testnet-magic $TESTNET_MAGIC

echo "✅ Payment address generated"

echo ""
echo "📝 Building stake address..."
$CARDANO_CLI latest stake-address build \
    --stake-verification-key-file /keys/stake.vkey \
    --out-file /keys/stake.addr \
    --testnet-magic $TESTNET_MAGIC

echo "✅ Stake address generated"

# Read and display the addresses
PAYMENT_ADDR=$(cat "$WALLET_DIR/payment.addr")
STAKE_ADDR=$(cat "$WALLET_DIR/stake.addr")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Wallet Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Payment Address (use this to receive funds):"
echo "   $PAYMENT_ADDR"
echo ""
echo "📍 Stake Address:"
echo "   $STAKE_ADDR"
echo ""
echo "🔐 Keys stored in: $WALLET_DIR"
echo ""
echo "⚠️  IMPORTANT: Keep your .skey files secure!"
echo "   These files contain your private keys."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Fund this wallet using the Cardano testnet faucet:"
echo "   https://docs.cardano.org/cardano-testnets/tools/faucet/"
echo ""
echo "2. Use this payment address:"
echo "   $PAYMENT_ADDR"
echo ""
echo "3. Check balance with:"
echo "   pnpm run check:balance"
echo ""
