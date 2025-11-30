import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import * as fs from 'fs';
import * as path from 'path';

interface WalletInfo {
  paymentAddress: string;
  stakeAddress: string;
  balance: {
    lovelace: string;
    ada: string;
  };
  utxos: any[];
}

/**
 * Cardano Preprod Testnet Client using Blockfrost API
 */
export class PreprodClient {
  private api: BlockFrostAPI;
  private walletDir: string;

  constructor(apiKey: string, walletDir?: string) {
    this.api = new BlockFrostAPI({
      projectId: apiKey,
      network: 'preprod',
    });
    
    this.walletDir = walletDir || path.join(process.cwd(), 'wallets', 'preprod', 'cardano');
  }

  /**
   * Get wallet addresses from files
   */
  async getWalletAddresses(): Promise<{ payment: string; stake: string }> {
    const paymentAddrPath = path.join(this.walletDir, 'payment.addr');
    const stakeAddrPath = path.join(this.walletDir, 'stake.addr');

    if (!fs.existsSync(paymentAddrPath)) {
      throw new Error(`Payment address file not found: ${paymentAddrPath}`);
    }

    if (!fs.existsSync(stakeAddrPath)) {
      throw new Error(`Stake address file not found: ${stakeAddrPath}`);
    }

    const payment = fs.readFileSync(paymentAddrPath, 'utf-8').trim();
    const stake = fs.readFileSync(stakeAddrPath, 'utf-8').trim();

    return { payment, stake };
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(address?: string): Promise<WalletInfo> {
    const addresses = await this.getWalletAddresses();
    const targetAddress = address || addresses.payment;

    try {
      const addressInfo = await this.api.addresses(targetAddress);
      const utxos = await this.api.addressesUtxos(targetAddress);

      const lovelace = addressInfo.amount.find(a => a.unit === 'lovelace')?.quantity || '0';
      const ada = (parseInt(lovelace) / 1_000_000).toFixed(6);

      return {
        paymentAddress: addresses.payment,
        stakeAddress: addresses.stake,
        balance: {
          lovelace,
          ada,
        },
        utxos,
      };
    } catch (error: any) {
      if (error.status_code === 404) {
        // Address not found on chain - likely not funded yet
        return {
          paymentAddress: addresses.payment,
          stakeAddress: addresses.stake,
          balance: {
            lovelace: '0',
            ada: '0.000000',
          },
          utxos: [],
        };
      }
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(txHash: string) {
    return await this.api.txs(txHash);
  }

  /**
   * Get transaction UTXOs
   */
  async getTransactionUtxos(txHash: string) {
    return await this.api.txsUtxos(txHash);
  }

  /**
   * Get latest block
   */
  async getLatestBlock() {
    return await this.api.blocksLatest();
  }

  /**
   * Get network parameters
   */
  async getProtocolParameters() {
    const latest = await this.api.epochsLatest();
    return await this.api.epochsParameters(latest.epoch);
  }

  /**
   * Get address transactions
   */
  async getAddressTransactions(address?: string, page = 1, count = 10) {
    const addresses = await this.getWalletAddresses();
    const targetAddress = address || addresses.payment;

    try {
      return await this.api.addressesTransactions(targetAddress, { page, count, order: 'desc' });
    } catch (error: any) {
      if (error.status_code === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash: string, maxAttempts = 60, intervalMs = 5000): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const tx = await this.getTransaction(txHash);
        if (tx.block_height) {
          console.log(`✅ Transaction confirmed in block ${tx.block_height}`);
          return true;
        }
      } catch (error: any) {
        if (error.status_code !== 404) {
          throw error;
        }
      }

      console.log(`⏳ Waiting for transaction confirmation... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    return false;
  }

  /**
   * Check if wallet is funded
   */
  async isWalletFunded(minLovelace = 1_000_000): Promise<boolean> {
    const walletInfo = await this.getWalletBalance();
    return parseInt(walletInfo.balance.lovelace) >= minLovelace;
  }

  /**
   * Get wallet summary
   */
  async getWalletSummary(): Promise<string> {
    const walletInfo = await this.getWalletBalance();
    const txs = await this.getAddressTransactions();

    let summary = '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    summary += '💼 Cardano Preprod Wallet Summary\n';
    summary += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    summary += `📍 Payment Address:\n   ${walletInfo.paymentAddress}\n\n`;
    summary += `📍 Stake Address:\n   ${walletInfo.stakeAddress}\n\n`;
    summary += `💰 Balance: ${walletInfo.balance.ada} ADA (${walletInfo.balance.lovelace} lovelace)\n\n`;
    summary += `📦 UTXOs: ${walletInfo.utxos.length}\n\n`;
    summary += `📜 Recent Transactions: ${txs.length}\n\n`;

    if (txs.length > 0) {
      summary += 'Recent transactions:\n';
      txs.slice(0, 5).forEach((tx, i) => {
        summary += `  ${i + 1}. ${tx.tx_hash}\n`;
      });
      summary += '\n';
    }

    summary += `🔗 View on Explorer:\n   https://preprod.cardanoscan.io/address/${walletInfo.paymentAddress}\n\n`;
    summary += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

    return summary;
  }
}

// Export singleton instance
let preprodClient: PreprodClient | null = null;

export function getPreprodClient(apiKey?: string): PreprodClient {
  if (!preprodClient) {
    const key = apiKey || process.env.BLOCKFROST_API_KEY;
    if (!key) {
      throw new Error('Blockfrost API key not provided');
    }
    preprodClient = new PreprodClient(key);
  }
  return preprodClient;
}
