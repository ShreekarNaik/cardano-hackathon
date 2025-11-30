
import * as fs from 'fs';
import * as path from 'path';

// Since we cannot run hydra-node to generate keys, and there is no easy JS library for it (it uses Ed25519 but specific serialization),
// we will try to generate standard Ed25519 keys and wrap them in the expected JSON format.
// Hydra uses standard Ed25519 keys.
// Format:
// {
//   "type": "HydraSigningKey_ed25519",
//   "description": "Hydra Signing Key",
//   "cborHex": "5820..."
// }

// We can use 'elliptic' or 'sodium-native' or similar. 
// Let's use 'cardano-serialization-lib-nodejs' PrivateKey if it supports raw Ed25519 generation.
// Or just use 'crypto' module if available in node.

import * as crypto from 'crypto';

async function main() {
  console.log('🔑 Generating Hydra Keys...');
  
  const keyDir = path.join(process.cwd(), 'wallets/preprod/hydra');
  
  // Generate Ed25519 key pair
  // Node.js crypto module supports ed25519
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519', {
    privateKeyEncoding: { format: 'der', type: 'pkcs8' },
    publicKeyEncoding: { format: 'der', type: 'spki' }
  });
  
  // We need raw bytes. DER encoding includes metadata.
  // This is getting complicated to extract raw bytes from DER in pure JS without a library.
  // Let's use CSL to generate a private key (it uses Ed25519 internally).
  
  // @ts-ignore
  const C = require('@emurgo/cardano-serialization-lib-nodejs');
  
  const rawKey = C.PrivateKey.generate_ed25519();
  const rawPub = rawKey.to_public();
  
  const skJson = {
    type: "HydraSigningKey_ed25519",
    description: "Hydra Signing Key",
    cborHex: "5820" + Buffer.from(rawKey.as_bytes()).toString('hex')
  };
  
  const vkJson = {
    type: "HydraVerificationKey_ed25519",
    description: "Hydra Verification Key",
    cborHex: "5820" + Buffer.from(rawPub.as_bytes()).toString('hex')
  };
  
  fs.writeFileSync(path.join(keyDir, 'hydra.sk'), JSON.stringify(skJson, null, 2));
  fs.writeFileSync(path.join(keyDir, 'hydra.vk'), JSON.stringify(vkJson, null, 2));
  
  console.log('✅ Generated hydra.sk and hydra.vk');
}

main();
