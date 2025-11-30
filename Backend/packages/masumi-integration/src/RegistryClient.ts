import axios, { AxiosInstance } from 'axios';
import {
  AgentProfile,
  AgentRegistration,
  AgentType,
  MasumiConfig,
  RegistryResponse,
  ReputationUpdate,
  ServiceQuery
} from './types';

/**
 * Masumi Registry Client
 * Handles agent registration, discovery, and reputation management
 */
export class RegistryClient {
  private client: AxiosInstance;
  private config: MasumiConfig;

  constructor(config: MasumiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.registryUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Register a new agent in the Masumi registry
   */
  async registerAgent(
    registration: AgentRegistration
  ): Promise<RegistryResponse<AgentProfile>> {
    try {
      const response = await this.client.post('/agents/register', {
        ...registration,
        network: this.config.network,
        registeredAt: new Date().toISOString()
      });

      return {
        success: true,
        data: this.parseAgentProfile(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to register agent',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get agent profile by ID
   */
  async getAgent(agentId: string): Promise<RegistryResponse<AgentProfile>> {
    try {
      const response = await this.client.get(`/agents/${agentId}`);

      return {
        success: true,
        data: this.parseAgentProfile(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch agent',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get agent profile by DID
   */
  async getAgentByDID(did: string): Promise<RegistryResponse<AgentProfile>> {
    try {
      const response = await this.client.get('/agents/by-did', {
        params: { did }
      });

      return {
        success: true,
        data: this.parseAgentProfile(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch agent by DID',
        timestamp: new Date()
      };
    }
  }

  /**
   * Discover agents based on query criteria
   */
  async discoverAgents(
    query: ServiceQuery
  ): Promise<RegistryResponse<AgentProfile[]>> {
    try {
      const response = await this.client.post('/agents/discover', {
        ...query,
        network: this.config.network
      });

      const agents = Array.isArray(response.data)
        ? response.data.map(this.parseAgentProfile)
        : [];

      return {
        success: true,
        data: agents,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to discover agents',
        timestamp: new Date()
      };
    }
  }

  /**
   * Update agent reputation
   */
  async updateReputation(
    update: ReputationUpdate
  ): Promise<RegistryResponse<AgentProfile>> {
    try {
      const response = await this.client.post('/agents/reputation', update);

      return {
        success: true,
        data: this.parseAgentProfile(response.data),
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update reputation',
        timestamp: new Date()
      };
    }
  }

  /**
   * Update agent activity timestamp
   */
  async updateActivity(agentId: string): Promise<RegistryResponse<void>> {
    try {
      await this.client.post(`/agents/${agentId}/activity`, {
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update activity',
        timestamp: new Date()
      };
    }
  }

  /**
   * Suspend an agent
   */
  async suspendAgent(
    agentId: string,
    reason: string,
    authority: string
  ): Promise<RegistryResponse<void>> {
    try {
      await this.client.post(`/agents/${agentId}/suspend`, {
        reason,
        authority,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to suspend agent',
        timestamp: new Date()
      };
    }
  }

  /**
   * Reactivate a suspended agent
   */
  async reactivateAgent(agentId: string): Promise<RegistryResponse<void>> {
    try {
      await this.client.post(`/agents/${agentId}/reactivate`);

      return {
        success: true,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to reactivate agent',
        timestamp: new Date()
      };
    }
  }

  /**
   * List all agents of a specific type
   */
  async listAgentsByType(
    agentType: AgentType,
    onlyActive: boolean = true
  ): Promise<RegistryResponse<AgentProfile[]>> {
    return this.discoverAgents({
      agentType,
      onlyActive
    });
  }

  /**
   * Get agents by capability
   */
  async getAgentsByCapability(
    capability: string,
    minReputation: number = 0
  ): Promise<RegistryResponse<AgentProfile[]>> {
    return this.discoverAgents({
      capabilities: [capability],
      minReputation,
      onlyActive: true
    });
  }

  /**
   * Get top agents by reputation
   */
  async getTopAgents(
    limit: number = 10,
    agentType?: AgentType
  ): Promise<RegistryResponse<AgentProfile[]>> {
    try {
      const query: ServiceQuery = {
        maxResults: limit,
        onlyActive: true
      };

      if (agentType) {
        query.agentType = agentType;
      }

      const result = await this.discoverAgents(query);

      if (result.success && result.data) {
        // Sort by reputation descending
        const sorted = [...result.data].sort(
          (a, b) => b.reputation - a.reputation
        );

        return {
          success: true,
          data: sorted.slice(0, limit),
          timestamp: new Date()
        };
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get top agents',
        timestamp: new Date()
      };
    }
  }

  /**
   * Health check for registry service
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
   * Parse agent profile from API response
   */
  private parseAgentProfile(data: any): AgentProfile {
    return {
      agentId: data.agentId || data.agent_id,
      agentType: data.agentType || data.agent_type,
      name: data.name,
      description: data.description,
      did: data.did,
      publicKey: data.publicKey || data.public_key,
      reputation: data.reputation || 500,
      tasksCompleted: data.tasksCompleted || data.tasks_completed || 0,
      successfulVerifications:
        data.successfulVerifications || data.successful_verifications || 0,
      failedVerifications:
        data.failedVerifications || data.failed_verifications || 0,
      registeredAt: new Date(data.registeredAt || data.registered_at),
      lastActive: new Date(data.lastActive || data.last_active),
      isActive: data.isActive ?? data.is_active ?? true,
      capabilities: data.capabilities || [],
      endpoint: data.endpoint,
      metadata: data.metadata
    };
  }
}
