#!/usr/bin/env ts-node

import { MasumiTestnetClient } from '../packages/masumi-integration/dist/testnet-client.js';
import { getPreprodClient } from '../packages/cardano-integration/dist/preprod-client.js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
  console.log('\n🤖 Registering Agent on Masumi Testnet...\n');

  try {
    const apiKey = process.env.BLOCKFROST_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: BLOCKFROST_API_KEY not found in .env file');
      process.exit(1);
    }

    // Get wallet address
    const cardanoClient = getPreprodClient(apiKey);
    const walletInfo = await cardanoClient.getWalletBalance();
    
    if (parseFloat(walletInfo.balance.ada) < 5) {
      console.error('❌ Error: Insufficient funds. Need at least 5 ADA for registration.');
      process.exit(1);
    }

    const masumiClient = new MasumiTestnetClient();
    
    const agent = {
      name: 'DecentralAI Analytics CEO',
      description: 'Autonomous CEO agent for decentralized analytics company',
      costPerRequest: 5, // 5 ADA
      tags: ['analytics', 'ai', 'cardano', 'data-science']
    };

    const result = await masumiClient.registerAgent(agent, walletInfo.paymentAddress);
    
    console.log('\n✅ Agent Registration Successful!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🆔 Agent ID: ${result.agentId}`);
    console.log(`👤 Name: ${result.name}`);
    console.log(`💰 Cost: ${result.costPerRequest} ADA`);
    console.log(`🏷️  Tags: ${result.tags.join(', ')}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
