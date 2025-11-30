
import { MeshWallet } from '@meshsdk/core';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🔑 Generating Cardano Keys...');
  
  const keyDir = path.join(process.cwd(), 'wallets/preprod/hydra');
  if (!fs.existsSync(keyDir)) {
    fs.mkdirSync(keyDir, { recursive: true });
  }

  try {
    // Generate a new mnemonic
    const mnemonic = MeshWallet.brew() as string[];
    console.log('📝 Mnemonic:', mnemonic);
    
    // Create wallet from mnemonic
    const wallet = new MeshWallet({
      networkId: 0, // Testnet
      key: {
        type: 'mnemonic',
        words: mnemonic
      }
    });
    
    const address = await wallet.getChangeAddress();
    console.log('📍 Address:', address);

    // Save mnemonic for reference
    fs.writeFileSync(path.join(keyDir, 'mnemonic.txt'), mnemonic.join(' '));
    
    // We need to export the signing key in a format compatible with cardano-cli/hydra-node
    // MeshSDK uses CSL. We need to extract the private key.
    // This is a bit tricky with just MeshSDK high-level API.
    // However, for the purpose of this task, if we can't get the .sk file exactly as cardano-cli produces,
    // we might be blocked on running the node unless we use the mnemonic to sign.
    // But hydra-node requires a file path to the signing key.
    
    console.log('⚠️  Note: This script generated a mnemonic. You still need to convert it to a .sk file for Hydra Node.');
    console.log('   For now, please use the mnemonic to recover the wallet if needed.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
