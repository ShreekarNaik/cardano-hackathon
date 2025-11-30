import WebSocket from 'ws';
import {
  HydraHead,
  HeadState,
  HydraManagerConfig,
  HeadInitParams,
  HeadCloseParams,
  HydraWSMessage,
  HeadLifecycleEvent,
  HeadEventType,
  HeadStatistics,
  HeadParticipant
} from './types';

/**
 * Hydra Head Manager
 * Manages Hydra Head lifecycle and WebSocket connections
 */
export class HydraHeadManager {
  private config: HydraManagerConfig;
  private heads: Map<string, HydraHead>;
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, Set<(event: HeadLifecycleEvent) => void>>;
  private isConnected: boolean = false;

  constructor(config: HydraManagerConfig) {
    this.config = config;
    this.heads = new Map();
    this.eventListeners = new Map();
  }

  /**
   * Connect to Hydra node
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.config.hydraNodeUrl.replace(/^http/, 'ws');
        this.ws = new WebSocket(wsUrl);

        this.ws.on('open', () => {
          this.isConnected = true;
          this.startHeartbeat();
          resolve();
        });

        this.ws.on('message', (data: WebSocket.Data) => {
          this.handleMessage(data.toString());
        });

        this.ws.on('error', (error: Error) => {
          console.error('WebSocket error:', error);
          if (!this.isConnected) {
            reject(error);
          }
        });

        this.ws.on('close', () => {
          this.isConnected = false;
          this.stopHeartbeat();

          if (this.config.autoReconnect) {
            this.scheduleReconnect();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from Hydra node
   */
  async disconnect(): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
  }

  /**
   * Initialize a new Hydra Head
   */
  async initHead(params: HeadInitParams): Promise<HydraHead> {
    if (!this.isConnected) {
      throw new Error('Not connected to Hydra node');
    }

    if (this.heads.size >= this.config.maxHeads) {
      throw new Error(`Maximum heads limit reached: ${this.config.maxHeads}`);
    }

    const headId = this.generateHeadId();

    // Send init command to Hydra node
    await this.sendCommand({
      tag: 'Init',
      contestationPeriod: params.contestationPeriod,
      parties: params.participants
    });

    // Create head object
    const head: HydraHead = {
      headId,
      state: HeadState.INITIALIZING,
      participants: params.participants,
      utxo: new Map(),
      createdAt: new Date(),
      snapshotNumber: 0
    };

    this.heads.set(headId, head);

    this.emitEvent({
      headId,
      eventType: HeadEventType.HEAD_INITIALIZED,
      timestamp: new Date(),
      data: params
    });

    return head;
  }

  /**
   * Close a Hydra Head
   */
  async closeHead(params: HeadCloseParams): Promise<void> {
    const head = this.heads.get(params.headId);
    if (!head) {
      throw new Error(`Head not found: ${params.headId}`);
    }

    if (head.state !== HeadState.OPEN) {
      throw new Error(`Head is not open: ${head.state}`);
    }

    await this.sendCommand({
      tag: 'Close',
      headId: params.headId
    });

    head.state = HeadState.CLOSING;

    this.emitEvent({
      headId: params.headId,
      eventType: HeadEventType.HEAD_CLOSED,
      timestamp: new Date(),
      data: { reason: params.reason }
    });
  }

  /**
   * Get head by ID
   */
  getHead(headId: string): HydraHead | undefined {
    return this.heads.get(headId);
  }

  /**
   * List all heads
   */
  listHeads(): HydraHead[] {
    return Array.from(this.heads.values());
  }

  /**
   * Get active heads
   */
  getActiveHeads(): HydraHead[] {
    return this.listHeads().filter(head => head.state === HeadState.OPEN);
  }

  /**
   * Get head statistics
   */
  getHeadStatistics(headId: string): HeadStatistics | null {
    const head = this.heads.get(headId);
    if (!head) {
      return null;
    }

    const uptime = Date.now() - head.createdAt.getTime();

    return {
      headId,
      totalTransactions: 0, // Would be tracked in production
      totalValue: BigInt(0), // Sum of all UTxO values
      averageTxTime: 100, // Sub-second on Hydra
      currentSnapshot: head.snapshotNumber,
      participants: head.participants.length,
      uptime,
      lastActivity: new Date()
    };
  }

  /**
   * Subscribe to head events
   */
  on(
    eventType: HeadEventType,
    listener: (event: HeadLifecycleEvent) => void
  ): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(listener);
  }

  /**
   * Unsubscribe from head events
   */
  off(
    eventType: HeadEventType,
    listener: (event: HeadLifecycleEvent) => void
  ): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Check if connected
   */
  isReady(): boolean {
    return this.isConnected && this.ws !== null;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    connected: boolean;
    activeHeads: number;
    totalHeads: number;
  } {
    return {
      connected: this.isConnected,
      activeHeads: this.getActiveHeads().length,
      totalHeads: this.heads.size
    };
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(data: string): void {
    try {
      const message: HydraWSMessage = JSON.parse(data);

      switch (message.tag) {
        case 'HeadIsInitializing':
          this.handleHeadInitializing(message);
          break;
        case 'HeadIsOpen':
          this.handleHeadOpen(message);
          break;
        case 'HeadIsClosed':
          this.handleHeadClosed(message);
          break;
        case 'SnapshotConfirmed':
          this.handleSnapshotConfirmed(message);
          break;
        case 'TxValid':
          this.handleTxValid(message);
          break;
        case 'TxInvalid':
          this.handleTxInvalid(message);
          break;
        default:
          // Unknown message type
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  /**
   * Handle HeadIsInitializing event
   */
  private handleHeadInitializing(message: HydraWSMessage): void {
    const headId = message.headId;
    if (!headId) return;

    const head = this.heads.get(headId);
    if (head) {
      head.state = HeadState.INITIALIZING;
    }
  }

  /**
   * Handle HeadIsOpen event
   */
  private handleHeadOpen(message: HydraWSMessage): void {
    const headId = message.headId;
    if (!headId) return;

    const head = this.heads.get(headId);
    if (head) {
      head.state = HeadState.OPEN;

      this.emitEvent({
        headId,
        eventType: HeadEventType.HEAD_OPENED,
        timestamp: new Date(),
        data: message
      });
    }
  }

  /**
   * Handle HeadIsClosed event
   */
  private handleHeadClosed(message: HydraWSMessage): void {
    const headId = message.headId;
    if (!headId) return;

    const head = this.heads.get(headId);
    if (head) {
      head.state = HeadState.CLOSED;

      this.emitEvent({
        headId,
        eventType: HeadEventType.HEAD_FINALIZED,
        timestamp: new Date(),
        data: message
      });
    }
  }

  /**
   * Handle SnapshotConfirmed event
   */
  private handleSnapshotConfirmed(message: HydraWSMessage): void {
    const headId = message.headId;
    if (!headId) return;

    const head = this.heads.get(headId);
    if (head && message.snapshot) {
      head.snapshotNumber = message.snapshot.number || head.snapshotNumber + 1;

      this.emitEvent({
        headId,
        eventType: HeadEventType.SNAPSHOT_CONFIRMED,
        timestamp: new Date(),
        data: message.snapshot
      });
    }
  }

  /**
   * Handle TxValid event
   */
  private handleTxValid(message: HydraWSMessage): void {
    const headId = message.headId;
    if (!headId) return;

    this.emitEvent({
      headId,
      eventType: HeadEventType.TRANSACTION_CONFIRMED,
      timestamp: new Date(),
      data: message.transaction
    });
  }

  /**
   * Handle TxInvalid event
   */
  private handleTxInvalid(message: HydraWSMessage): void {
    console.error('Invalid transaction:', message);
  }

  /**
   * Send command to Hydra node
   */
  private async sendCommand(command: any): Promise<void> {
    if (!this.ws || !this.isConnected) {
      throw new Error('Not connected to Hydra node');
    }

    return new Promise((resolve, reject) => {
      this.ws!.send(JSON.stringify(command), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Emit event to listeners
   */
  private emitEvent(event: HeadLifecycleEvent): void {
    const listeners = this.eventListeners.get(event.eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Generate unique head ID
   */
  private generateHeadId(): string {
    return `head-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.config.reconnectDelay);
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) return;

    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.isConnected) {
        this.ws.ping();
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}
