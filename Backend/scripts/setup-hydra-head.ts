#!/usr/bin/env ts-node

import { PreprodHydraClient } from '../packages/hydra-layer2/dist/preprod-hydra.js';
import { getPreprodClient } from '../packages/cardano-integration/dist/preprod-client.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
  console.log('\n🐍 Setting up Hydra Head on Preprod Testnet...\n');

  try {
    const apiKey = process.env.BLOCKFROST_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: BLOCKFROST_API_KEY not found in .env file');
      process.exit(1);
    }

    // 2. Check Sync Status via Ogmios
    try {
      // We use dynamic import or fetch if available, or just use child_process curl
      const { execSync } = require('child_process');
      const ogmiosUrl = 'http://localhost:1337/health';
      console.log(`🔄 Checking Node Sync Status via Ogmios (${ogmiosUrl})...`);
      
      const output = execSync(`curl -s ${ogmiosUrl}`).toString();
      const health = JSON.parse(output);
      
      const syncProgress = health.networkSynchronization * 100;
      console.log(`📉 Sync Progress: ${syncProgress.toFixed(2)}%`);
      
      if (syncProgress < 99.0) {
        console.warn('⚠️  WARNING: Cardano Node is not fully synced.');
        console.warn('   Hydra Head initialization requires the node to be synced to the latest era (Conway).');
        console.warn('   Current Era: ' + health.currentEra);
        console.warn('   Please wait for the node to sync before running this script.');
        // We can exit here or allow user to force?
        // Better to exit to avoid confusion.
        console.error('❌ Exiting due to lack of synchronization.');
        process.exit(1);
      }
    } catch (error) {
      console.warn('⚠️  Could not check sync status via Ogmios. Is Ogmios running?');
      console.warn('   Proceeding with caution...');
    }
    
    // 3. Check Wallet Balance
    const cardanoClient = getPreprodClient(apiKey);
    const walletInfo = await cardanoClient.getWalletBalance();
    
    console.log(`📍 Wallet Address: ${walletInfo.paymentAddress}`);
    console.log(`💰 Balance: ${walletInfo.balance.ada} ADA`);

    if (parseFloat(walletInfo.balance.ada) < 10) {
      console.error('❌ Error: Insufficient funds. Need at least 10 ADA for Hydra Head initialization.');
      process.exit(1);
    }

    // 4. Check Configuration

    // 2. Check Configuration
    const hydraScriptsTxId = process.env.HYDRA_SCRIPTS_TX_ID;
    if (!hydraScriptsTxId) {
      console.error('❌ Error: HYDRA_SCRIPTS_TX_ID not found in .env file');
      console.error('   Please set it to the latest Preprod Hydra Scripts TxID.');
      process.exit(1);
    }

    const keyDir = path.join(process.cwd(), 'wallets', 'preprod', 'hydra');
    const hasKeys = fs.existsSync(path.join(keyDir, 'cardano.sk')) && fs.existsSync(path.join(keyDir, 'hydra.sk'));
    
    if (!hasKeys) {
      console.error(`❌ Error: Hydra keys not found in ${keyDir}`);
      console.error('   Please generate cardano.sk and hydra.sk. See wallets/preprod/hydra/README.md');
      process.exit(1);
    }

    // 3. Connect to Hydra Node
    const hydraClient = new PreprodHydraClient();
    
    console.log('🔄 Connecting to Hydra Node (ws://localhost:4001)...');
    let connected = false;
    let retries = 10;
    
    while (retries > 0 && !connected) {
      try {
        await hydraClient.connect();
        connected = true;
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error('❌ Could not connect to local Hydra node (ws://localhost:4001) after multiple attempts.');
          console.error('   Ensure the node is running: docker-compose -f docker-compose.preprod.yml up -d hydra-node-preprod');
          console.error('   Check logs: docker-compose -f docker-compose.preprod.yml logs hydra-node-preprod');
          process.exit(1);
        }
        console.log(`⚠️  Connection failed. Retrying in 5 seconds... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Real interaction if connected
    await hydraClient.initHead();
    
    // Find a UTXO to commit
    if (walletInfo.utxos.length > 0) {
      const utxo = walletInfo.utxos[0];
      await hydraClient.commitFunds(utxo.tx_hash + '#' + utxo.output_index);
    } else {
      console.log('⚠️  No UTXOs available to commit');
    }

    // Keep connection open briefly to receive updates
    await new Promise(resolve => setTimeout(resolve, 5000));
    hydraClient.disconnect();

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
