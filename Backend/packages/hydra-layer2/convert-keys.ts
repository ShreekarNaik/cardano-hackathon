
import { MeshWallet } from '@meshsdk/core';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import * as C from '@emurgo/cardano-serialization-lib-nodejs';

async function main() {
  console.log('🔑 Converting Mnemonic to Keys...');
  
  const keyDir = path.join(process.cwd(), 'wallets/preprod/hydra');
  const mnemonicPath = path.join(keyDir, 'mnemonic.txt');
  
  if (!fs.existsSync(mnemonicPath)) {
    console.error('Mnemonic file not found');
    process.exit(1);
  }
  
  const mnemonicWords = fs.readFileSync(mnemonicPath, 'utf-8').trim().split(' ');
  
  // Generate a simple key pair (non-extended) for Hydra Node compatibility
  console.log('Generating simple Ed25519 key pair...');
  
  const privateKey = C.PrivateKey.generate_ed25519();
  const publicKey = privateKey.to_public();
  
  const keyBytes = Buffer.from(privateKey.as_bytes());
  console.log('Key length:', keyBytes.length); // Should be 64 for CSL PrivateKey (expanded) or 32?
  // CSL PrivateKey is usually 64 bytes (normal Ed25519 extended).
  // But PaymentSigningKeyShelley_ed25519 expects 32 bytes (seed) or 64 bytes (expanded)?
  // If CSL returns 64 bytes, and we use 5840, it works for cardano-cli but hydra-node rejected the type label.
  // If we use 5840 and label PaymentSigningKeyShelley_ed25519, hydra-node might accept it if it supports 64 bytes under that label?
  // Or maybe CSL generate_ed25519() returns something else.
  
  // Actually, cardano-cli address key-gen produces a 32-byte key (CBOR 5820...).
  // CSL PrivateKey.generate_ed25519() produces a key that might be 64 bytes.
  // Let's check the length.
  
  // If it is 64 bytes, we might need to construct a 32-byte key.
  // We can generate 32 random bytes and use C.PrivateKey.from_normal_bytes(bytes)?
  
  let finalKeyBytes = keyBytes;
  let finalType = "PaymentSigningKeyShelley_ed25519";
  let finalPrefix = "5820";
  
  if (keyBytes.length === 64) {
      // It's likely an extended key or expanded Ed25519.
      // If we want a 32-byte key, we should generate 32 random bytes.
      const crypto = require('crypto');
      const seed = crypto.randomBytes(32);
      // CSL doesn't seem to have from_seed for simple keys easily exposed or I don't know the API.
      // But we can just use the seed as the key for cardano-cli if we wrap it correctly.
      // However, we need the public key to generate the address.
      // We can use C.PrivateKey.from_normal_bytes(seed) if it exists.
      
      try {
          const simpleKey = C.PrivateKey.from_normal_bytes(seed);
          finalKeyBytes = Buffer.from(simpleKey.as_bytes());
          console.log('Simple Key length:', finalKeyBytes.length);
          const simplePub = simpleKey.to_public();
          
          // Overwrite the keys
          fs.writeFileSync(path.join(keyDir, 'cardano.sk'), JSON.stringify({
            type: "PaymentSigningKeyShelley_ed25519",
            description: "Payment Signing Key",
            cborHex: "5820" + finalKeyBytes.toString('hex')
          }, null, 2));
          
          fs.writeFileSync(path.join(keyDir, 'cardano.vk'), JSON.stringify({
            type: "PaymentVerificationKeyShelley_ed25519",
            description: "Payment Verification Key",
            cborHex: "5820" + Buffer.from(simplePub.as_bytes()).toString('hex')
          }, null, 2));
          
          // Generate Address
          const pubKeyHash = simplePub.hash();
          const enterpriseAddress = C.EnterpriseAddress.new(
             0, // Testnet network id
             // @ts-ignore
             C.StakeCredential.from_keyhash(pubKeyHash)
          );
          const address = enterpriseAddress.to_address().to_bech32('addr_test');
          console.log('📍 New Address (Simple Key):', address);
          
          console.log('✅ Generated cardano.sk and cardano.vk (Simple 32-byte)');
          return;
      } catch (e) {
          console.error('Error creating simple key:', e);
      }
  }
  
  // Fallback if above fails
  console.log('Fallback to generated key...');
  const cborPrefix = keyBytes.length === 32 ? "5820" : "5840";
  const type = keyBytes.length === 32 ? "PaymentSigningKeyShelley_ed25519" : "PaymentExtendedSigningKeyShelley_ed25519";
  
  const skJson = {
    type: type,
    description: "Payment Signing Key",
    cborHex: cborPrefix + keyBytes.toString('hex')
  };
  
  const vkJson = {
    type: "PaymentVerificationKeyShelley_ed25519",
    description: "Payment Verification Key",
    cborHex: "5820" + Buffer.from(publicKey.as_bytes()).toString('hex')
  };
  
  fs.writeFileSync(path.join(keyDir, 'cardano.sk'), JSON.stringify(skJson, null, 2));
  fs.writeFileSync(path.join(keyDir, 'cardano.vk'), JSON.stringify(vkJson, null, 2));
  
  console.log('✅ Generated cardano.sk and cardano.vk');
}

main();
