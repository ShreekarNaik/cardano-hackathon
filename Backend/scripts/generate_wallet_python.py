"""
Generate Cardano Wallet Keys using Python

This creates a Cardano wallet without requiring cardano-cli
Uses pycardano library for key generation
"""

import os
import json
from pathlib import Path

try:
    from pycardano import PaymentSigningKey, PaymentVerificationKey, StakeSigningKey, StakeVerificationKey, Address, Network
    PYCARDANO_AVAILABLE = True
except ImportError:
    PYCARDANO_AVAILABLE = False
    print("⚠️  pycardano not installed")
    print("Installing pycardano...")
    import subprocess
    subprocess.run(["pip", "install", "pycardano"], check=True)
    from pycardano import PaymentSigningKey, PaymentVerificationKey, StakeSigningKey, StakeVerificationKey, Address, Network
    PYCARDANO_AVAILABLE = True


def generate_wallet():
    """Generate Cardano wallet keys"""
    
    # Create directory
    cardano_dir = Path.home() / "cardano" / "preprod"
    cardano_dir.mkdir(parents=True, exist_ok=True)
    
    print("🔑 Generating Cardano Wallet Keys...")
    print()
    
    # Generate payment keys
    payment_skey_file = cardano_dir / "payment.skey"
    payment_vkey_file = cardano_dir / "payment.vkey"
    
    if not payment_skey_file.exists():
        print("📝 Generating payment keys...")
        payment_skey = PaymentSigningKey.generate()
        payment_vkey = PaymentVerificationKey.from_signing_key(payment_skey)
        
        # Save keys
        with open(payment_skey_file, 'w') as f:
            json.dump({
                "type": "PaymentSigningKeyShelley_ed25519",
                "description": "Payment Signing Key",
                "cborHex": payment_skey.to_cbor().hex()
            }, f, indent=2)
        
        with open(payment_vkey_file, 'w') as f:
            json.dump({
                "type": "PaymentVerificationKeyShelley_ed25519",
                "description": "Payment Verification Key",
                "cborHex": payment_vkey.to_cbor().hex()
            }, f, indent=2)
        
        print("✅ Payment keys generated")
    else:
        print("✅ Payment keys already exist")
        # Load existing keys
        with open(payment_skey_file) as f:
            payment_skey = PaymentSigningKey.from_cbor(bytes.fromhex(json.load(f)['cborHex']))
        payment_vkey = PaymentVerificationKey.from_signing_key(payment_skey)
    
    # Generate stake keys
    stake_skey_file = cardano_dir / "stake.skey"
    stake_vkey_file = cardano_dir / "stake.vkey"
    
    if not stake_skey_file.exists():
        print("📝 Generating stake keys...")
        stake_skey = StakeSigningKey.generate()
        stake_vkey = StakeVerificationKey.from_signing_key(stake_skey)
        
        # Save keys
        with open(stake_skey_file, 'w') as f:
            json.dump({
                "type": "StakeSigningKeyShelley_ed25519",
                "description": "Stake Signing Key",
                "cborHex": stake_skey.to_cbor().hex()
            }, f, indent=2)
        
        with open(stake_vkey_file, 'w') as f:
            json.dump({
                "type": "StakeVerificationKeyShelley_ed25519",
                "description": "Stake Verification Key",
                "cborHex": stake_vkey.to_cbor().hex()
            }, f, indent=2)
        
        print("✅ Stake keys generated")
    else:
        print("✅ Stake keys already exist")
        # Load existing keys
        with open(stake_skey_file) as f:
            stake_skey = StakeSigningKey.from_cbor(bytes.fromhex(json.load(f)['cborHex']))
        stake_vkey = StakeVerificationKey.from_signing_key(stake_skey)
    
    # Build payment address
    addr_file = cardano_dir / "payment.addr"
    
    if not addr_file.exists():
        print("📝 Building payment address...")
        address = Address(payment_vkey.hash(), stake_vkey.hash(), Network.TESTNET)
        
        with open(addr_file, 'w') as f:
            f.write(str(address))
        
        print("✅ Payment address created")
    else:
        print("✅ Payment address already exists")
        with open(addr_file) as f:
            address = f.read().strip()
    
    print()
    print("=" * 60)
    print("✅ Wallet Setup Complete!")
    print("=" * 60)
    print()
    print("Your Cardano Preprod Testnet Address:")
    print(address)
    print()
    print(f"Files created in: {cardano_dir}")
    print("  • payment.skey (signing key - KEEP SECRET!)")
    print("  • payment.vkey (verification key)")
    print("  • stake.skey (stake signing key)")
    print("  • stake.vkey (stake verification key)")
    print("  • payment.addr (your testnet address)")
    print()
    print("⚠️  IMPORTANT: Backup these keys securely!")
    print()
    print("=" * 60)
    print()
    
    return str(address)


if __name__ == "__main__":
    address = generate_wallet()
    
    print("Next steps:")
    print("1. Visit: https://docs.cardano.org/cardano-testnet/tools/faucet/")
    print(f"2. Request test ADA for address: {address}")
    print("3. Wait for confirmation (usually 1-2 minutes)")
    print()
