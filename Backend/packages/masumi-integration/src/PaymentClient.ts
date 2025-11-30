import axios, { AxiosInstance } from 'axios';
import {
  MasumiConfig,
  PaymentChannel,
  PaymentReceipt,
  PaymentRequest,
  RegistryResponse
} from './types';

/**
 * Masumi Payment Client
 * Handles payment channels and transactions between agents
 */
export class PaymentClient {
  private client: AxiosInstance;
  private config: MasumiConfig;

  constructor(config: MasumiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.paymentUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Open a new payment channel
   */
  async openChannel(
    payer: string,
    payee: string,
    initialDeposit: bigint,
    expirationDays: number = 30
  ): Promise<RegistryResponse<PaymentChannel>> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);

      const response = await this.client.post('/channels/open', {
        payer,
        payee,
        initialDeposit: initialDeposit.toString(),
        expiresAt: expiresAt.toISOString(),
        network: this.config.network
      });

      return {
        success: true,
        data: this.parsePaymentChannel(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to open payment channel',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get payment channel by ID
   */
  async getChannel(
    channelId: string
  ): Promise<RegistryResponse<PaymentChannel>> {
    try {
      const response = await this.client.get(`/channels/${channelId}`);

      return {
        success: true,
        data: this.parsePaymentChannel(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get payment channel',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get all channels for an agent
   */
  async getAgentChannels(
    agentDID: string
  ): Promise<RegistryResponse<PaymentChannel[]>> {
    try {
      const response = await this.client.get('/channels/agent', {
        params: { did: agentDID }
      });

      const channels = Array.isArray(response.data)
        ? response.data.map(this.parsePaymentChannel)
        : [];

      return {
        success: true,
        data: channels,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get agent channels',
        timestamp: new Date()
      };
    }
  }

  /**
   * Make a payment through an existing channel
   */
  async makePayment(
    request: PaymentRequest
  ): Promise<RegistryResponse<PaymentReceipt>> {
    try {
      const response = await this.client.post('/payments/send', {
        ...request,
        amount: request.amount.toString(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: this.parsePaymentReceipt(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to make payment',
        timestamp: new Date()
      };
    }
  }

  /**
   * Deposit additional funds into a channel
   */
  async depositToChannel(
    channelId: string,
    amount: bigint
  ): Promise<RegistryResponse<PaymentChannel>> {
    try {
      const response = await this.client.post(`/channels/${channelId}/deposit`, {
        amount: amount.toString()
      });

      return {
        success: true,
        data: this.parsePaymentChannel(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to deposit to channel',
        timestamp: new Date()
      };
    }
  }

  /**
   * Withdraw funds from a channel
   */
  async withdrawFromChannel(
    channelId: string,
    amount: bigint
  ): Promise<RegistryResponse<PaymentChannel>> {
    try {
      const response = await this.client.post(
        `/channels/${channelId}/withdraw`,
        {
          amount: amount.toString()
        }
      );

      return {
        success: true,
        data: this.parsePaymentChannel(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to withdraw from channel',
        timestamp: new Date()
      };
    }
  }

  /**
   * Close a payment channel
   */
  async closeChannel(channelId: string): Promise<RegistryResponse<void>> {
    try {
      await this.client.post(`/channels/${channelId}/close`);

      return {
        success: true,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to close channel',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get payment history for an agent
   */
  async getPaymentHistory(
    agentDID: string,
    limit: number = 50
  ): Promise<RegistryResponse<PaymentReceipt[]>> {
    try {
      const response = await this.client.get('/payments/history', {
        params: { did: agentDID, limit }
      });

      const payments = Array.isArray(response.data)
        ? response.data.map(this.parsePaymentReceipt)
        : [];

      return {
        success: true,
        data: payments,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get payment history',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get payment by transaction ID
   */
  async getPayment(
    transactionId: string
  ): Promise<RegistryResponse<PaymentReceipt>> {
    try {
      const response = await this.client.get(`/payments/${transactionId}`);

      return {
        success: true,
        data: this.parsePaymentReceipt(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get payment',
        timestamp: new Date()
      };
    }
  }

  /**
   * Calculate total balance across all channels for an agent
   */
  async getTotalBalance(agentDID: string): Promise<RegistryResponse<bigint>> {
    try {
      const channelsResult = await this.getAgentChannels(agentDID);

      if (!channelsResult.success || !channelsResult.data) {
        return {
          success: false,
          error: 'Failed to fetch channels',
          timestamp: new Date()
        };
      }

      const total = channelsResult.data.reduce(
        (sum, channel) => sum + channel.balance,
        BigInt(0)
      );

      return {
        success: true,
        data: total,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to calculate total balance',
        timestamp: new Date()
      };
    }
  }

  /**
   * Health check for payment service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Parse payment channel from API response
   */
  private parsePaymentChannel(data: any): PaymentChannel {
    return {
      channelId: data.channelId || data.channel_id,
      payer: data.payer,
      payee: data.payee,
      balance: BigInt(data.balance || '0'),
      deposited: BigInt(data.deposited || '0'),
      withdrawn: BigInt(data.withdrawn || '0'),
      nonce: data.nonce || 0,
      expiresAt: new Date(data.expiresAt || data.expires_at),
      state: data.state || 'OPEN'
    };
  }

  /**
   * Parse payment receipt from API response
   */
  private parsePaymentReceipt(data: any): PaymentReceipt {
    return {
      transactionId: data.transactionId || data.transaction_id,
      from: data.from,
      to: data.to,
      amount: BigInt(data.amount || '0'),
      timestamp: new Date(data.timestamp),
      confirmed: data.confirmed ?? false
    };
  }
}
