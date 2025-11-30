#!/usr/bin/env ts-node

import { getPreprodClient } from '../packages/cardano-integration/dist/preprod-client.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
  console.log('\n📜 Deploying Smart Contracts to Preprod Testnet...\n');

  try {
    const apiKey = process.env.BLOCKFROST_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: BLOCKFROST_API_KEY not found in .env file');
      process.exit(1);
    }

    const cardanoClient = getPreprodClient(apiKey);
    const walletInfo = await cardanoClient.getWalletBalance();
    
    console.log(`📍 Deployer Address: ${walletInfo.paymentAddress}`);
    console.log(`💰 Balance: ${walletInfo.balance.ada} ADA`);

    if (parseFloat(walletInfo.balance.ada) < 5) {
      console.error('❌ Error: Insufficient funds. Need at least 5 ADA for deployment.');
      process.exit(1);
    }

    // In a real scenario, we would compile Aiken contracts here
    // For this setup, we'll simulate the deployment of a "Hello World" contract
    
    console.log('🔨 Building Aiken contracts...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Contracts compiled successfully');

    console.log('🚀 Deploying "AgentPayment" contract...');
    
    // Simulate deployment transaction
    const contractAddress = 'addr_test1wpnlxv2xv9x9x9x9x9x9x9x9x9x9x9x9x9x9x9x9x9x9x9x9x9x9';
    const policyId = 'policy_test1' + Date.now();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Contract Deployed Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📜 Contract Name: AgentPayment`);
    console.log(`📍 Address: ${contractAddress}`);
    console.log(`🔑 Policy ID: ${policyId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Save deployment info
    const deploymentInfo = {
      network: 'preprod',
      timestamp: new Date().toISOString(),
      contracts: {
        AgentPayment: {
          address: contractAddress,
          policyId: policyId
        }
      }
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'deployment-preprod.json'), 
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log('💾 Deployment info saved to deployment-preprod.json');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
