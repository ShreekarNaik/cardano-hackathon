import { getPreprodClient } from '../../packages/cardano-integration/dist/preprod-client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

describe('Cardano Transactions', () => {
  const apiKey = process.env.BLOCKFROST_API_KEY;
  const client = getPreprodClient(apiKey);

  it('should fetch transaction history', async () => {
    const history = await client.getAddressTransactions();
    
    expect(history).toBeDefined();
    expect(Array.isArray(history)).toBe(true);
    
    if (history.length > 0) {
      const tx = history[0];
      expect(tx.tx_hash).toBeDefined();
      console.log(`Latest Transaction: ${tx.tx_hash}`);
    } else {
      console.log('No transactions found yet (new wallet)');
    }
  });

  it('should be able to build a transaction (simulation)', async () => {
    const walletInfo = await client.getWalletBalance();
    const recipient = 'addr_test1vpqgspvmh6m2m5pzgzd23z277gu97n8n0k66h3k5w6q6qgq9q9q9q'; // Burn address
    const amount = 1.5; // 1.5 ADA

    // In a real test, we would submit this, but we don't want to waste test ADA on every run
    // So we just verify we have enough balance
    expect(parseFloat(walletInfo.balance.ada)).toBeGreaterThan(amount);
    
    console.log(`Ready to send ${amount} ADA to ${recipient}`);
  });
});
