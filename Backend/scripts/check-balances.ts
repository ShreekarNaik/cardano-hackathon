#!/usr/bin/env ts-node

import { getPreprodClient } from '../packages/cardano-integration/dist/preprod-client.js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
  console.log('\n🔍 Checking Cardano Preprod Wallet Balance...\n');

  try {
    const apiKey = process.env.BLOCKFROST_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: BLOCKFROST_API_KEY not found in .env file');
      process.exit(1);
    }

    const client = getPreprodClient(apiKey);
    
    // Get and display wallet summary
    const summary = await client.getWalletSummary();
    console.log(summary);

    // Check if wallet is funded
    const isFunded = await client.isWalletFunded();
    
    if (!isFunded) {
      console.log('⚠️  Wallet needs funding!');
      console.log('\n📝 To fund your wallet:');
      console.log('1. Visit: https://docs.cardano.org/cardano-testnets/tools/faucet/');
      console.log('2. Select "Preprod Testnet"');
      console.log('3. Enter your payment address (shown above)');
      console.log('4. Request test ADA\n');
    } else {
      console.log('✅ Wallet is funded and ready to use!\n');
    }

  } catch (error: any) {
    if (error.message.includes('not found')) {
      console.error('\n❌ Error: Wallet not set up yet');
      console.error('\n📝 To set up your wallet, run:');
      console.error('   ./scripts/setup-preprod-wallets.sh\n');
    } else {
      console.error('\n❌ Error:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
    }
    process.exit(1);
  }
}

main();
