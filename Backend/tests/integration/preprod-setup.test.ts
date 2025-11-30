import { getPreprodClient } from '../../packages/cardano-integration/dist/preprod-client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

describe('Preprod Infrastructure Setup', () => {
  const apiKey = process.env.BLOCKFROST_API_KEY;

  it('should have BLOCKFROST_API_KEY set', () => {
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe('');
  });

  it('should connect to Blockfrost API', async () => {
    const client = getPreprodClient(apiKey);
    const latestBlock = await client.getLatestBlock();
    
    expect(latestBlock).toBeDefined();
    expect(latestBlock.hash).toBeDefined();
    expect(latestBlock.slot).toBeGreaterThan(0);
    console.log(`Latest Block: ${latestBlock.height} (Slot: ${latestBlock.slot})`);
  });

  it('should have a funded wallet', async () => {
    const client = getPreprodClient(apiKey);
    const walletInfo = await client.getWalletBalance();
    
    expect(walletInfo.paymentAddress).toBeDefined();
    expect(walletInfo.paymentAddress).toMatch(/^addr_test1/);
    
    const balance = parseFloat(walletInfo.balance.ada);
    expect(balance).toBeGreaterThan(0);
    console.log(`Wallet Balance: ${balance} ADA`);
  });
});
