import {
  Subtask,
  SubtaskResult,
  VotingRecord,
  Vote,
  MAKERReputationUpdate
} from './types';

/**
 * Voting Manager
 * Implements multi-agent voting for consensus and error detection
 * Based on MAKER framework majority voting mechanism
 */
export class VotingManager {
  private minVoters: number;
  private consensusThreshold: number;

  constructor(minVoters: number = 3, consensusThreshold: number = 0.6) {
    this.minVoters = Math.max(3, minVoters); // Minimum 3 voters
    this.consensusThreshold = Math.max(0.5, Math.min(1.0, consensusThreshold));
  }

  /**
   * Conduct voting on subtask results
   */
  async conductVoting(
    subtask: Subtask,
    results: SubtaskResult[],
    agentReputations: Map<string, number>
  ): Promise<VotingRecord> {
    if (results.length < this.minVoters) {
      throw new Error(
        `Insufficient voters: ${results.length} < ${this.minVoters}`
      );
    }

    // Create votes with reputation weights
    const votes: Vote[] = results.map(result => ({
      agentId: result.agentId,
      agentDID: result.agentDID,
      result: result.result,
      confidence: result.confidence,
      reputation: agentReputations.get(result.agentDID) || 500
    }));

    // Find majority result
    const { majorityResult, consensusConfidence, minorityResults } =
      this.findMajority(votes);

    return {
      subtaskId: subtask.id,
      voterAgents: votes.map(v => v.agentDID),
      votes,
      majorityResult,
      consensusConfidence,
      minorityResults,
      timestamp: new Date()
    };
  }

  /**
   * Find majority result using weighted voting
   */
  private findMajority(votes: Vote[]): {
    majorityResult: any;
    consensusConfidence: number;
    minorityResults: any[];
  } {
    // Group votes by result similarity
    const resultGroups = this.groupSimilarResults(votes);

    // Weight each group by reputation and confidence
    const weightedGroups = resultGroups.map(group => ({
      result: group.representative,
      votes: group.votes,
      totalWeight: group.votes.reduce(
        (sum, vote) => sum + vote.reputation * vote.confidence,
        0
      ),
      avgConfidence:
        group.votes.reduce((sum, vote) => sum + vote.confidence, 0) /
        group.votes.length,
      count: group.votes.length
    }));

    // Sort by total weight descending
    weightedGroups.sort((a, b) => b.totalWeight - a.totalWeight);

    const majorityGroup = weightedGroups[0];
    const totalWeight = weightedGroups.reduce(
      (sum, g) => sum + g.totalWeight,
      0
    );

    // Calculate consensus confidence
    const consensusConfidence =
      totalWeight > 0 ? majorityGroup.totalWeight / totalWeight : 0;

    // Extract minority results
    const minorityResults = weightedGroups
      .slice(1)
      .map(g => g.result)
      .filter(Boolean);

    return {
      majorityResult: majorityGroup.result,
      consensusConfidence,
      minorityResults
    };
  }

  /**
   * Group similar results together
   */
  private groupSimilarResults(
    votes: Vote[]
  ): Array<{ representative: any; votes: Vote[] }> {
    const groups: Array<{ representative: any; votes: Vote[] }> = [];

    for (const vote of votes) {
      // Find existing group with similar result
      let foundGroup = false;

      for (const group of groups) {
        if (this.areResultsSimilar(vote.result, group.representative)) {
          group.votes.push(vote);
          foundGroup = true;
          break;
        }
      }

      // Create new group if no match found
      if (!foundGroup) {
        groups.push({
          representative: vote.result,
          votes: [vote]
        });
      }
    }

    return groups;
  }

  /**
   * Check if two results are similar enough to be grouped
   */
  private areResultsSimilar(result1: any, result2: any): boolean {
    // Handle null/undefined
    if (result1 === result2) return true;
    if (result1 == null || result2 == null) return false;

    // Handle primitives
    if (typeof result1 !== 'object' || typeof result2 !== 'object') {
      return result1 === result2;
    }

    // Handle arrays
    if (Array.isArray(result1) && Array.isArray(result2)) {
      if (result1.length !== result2.length) return false;
      return result1.every((val, idx) =>
        this.areResultsSimilar(val, result2[idx])
      );
    }

    // Handle objects - deep comparison
    const keys1 = Object.keys(result1);
    const keys2 = Object.keys(result2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key =>
      this.areResultsSimilar(result1[key], result2[key])
    );
  }

  /**
   * Generate reputation updates based on voting results
   */
  generateReputationUpdates(
    votingRecord: VotingRecord
  ): MAKERReputationUpdate[] {
    const updates: MAKERReputationUpdate[] = [];

    for (const vote of votingRecord.votes) {
      const wasInMajority = this.areResultsSimilar(
        vote.result,
        votingRecord.majorityResult
      );

      // Calculate confidence accuracy
      // If in majority, reward high confidence; penalize low confidence
      // If in minority, penalize high confidence; reward low confidence
      const confidenceAccuracy = wasInMajority
        ? vote.confidence
        : 1 - vote.confidence;

      // Reputation delta calculation
      let reputationDelta = 0;

      if (wasInMajority) {
        // Reward for being in majority
        reputationDelta = Math.floor(
          10 * confidenceAccuracy * votingRecord.consensusConfidence
        );
      } else {
        // Penalty for being in minority
        reputationDelta = -Math.floor(
          5 * vote.confidence * (1 - votingRecord.consensusConfidence)
        );
      }

      updates.push({
        agentId: vote.agentId,
        agentDID: vote.agentDID,
        subtaskId: votingRecord.subtaskId,
        wasInMajority,
        confidenceAccuracy,
        executionTime: 0, // Will be filled by orchestrator
        reputationDelta
      });
    }

    return updates;
  }

  /**
   * Check if consensus meets threshold
   */
  hasConsensus(votingRecord: VotingRecord): boolean {
    return votingRecord.consensusConfidence >= this.consensusThreshold;
  }

  /**
   * Detect potential errors based on voting patterns
   */
  detectErrors(votingRecord: VotingRecord): {
    hasErrors: boolean;
    errorType?: string;
    confidence: number;
  } {
    // Low consensus indicates potential errors
    if (votingRecord.consensusConfidence < 0.5) {
      return {
        hasErrors: true,
        errorType: 'LOW_CONSENSUS',
        confidence: 1 - votingRecord.consensusConfidence
      };
    }

    // High disagreement with multiple strong minorities
    const minorityCount = votingRecord.minorityResults.length;
    if (minorityCount >= 2 && votingRecord.consensusConfidence < 0.7) {
      return {
        hasErrors: true,
        errorType: 'HIGH_DISAGREEMENT',
        confidence: 0.7
      };
    }

    // Check if all voters had low confidence
    const avgConfidence =
      votingRecord.votes.reduce((sum, v) => sum + v.confidence, 0) /
      votingRecord.votes.length;

    if (avgConfidence < 0.5) {
      return {
        hasErrors: true,
        errorType: 'LOW_VOTER_CONFIDENCE',
        confidence: 0.6
      };
    }

    return {
      hasErrors: false,
      confidence: votingRecord.consensusConfidence
    };
  }

  /**
   * Calculate voting statistics
   */
  calculateStatistics(votingRecord: VotingRecord): {
    totalVoters: number;
    majoritySize: number;
    minoritySize: number;
    consensusStrength: string;
    avgReputation: number;
    avgConfidence: number;
  } {
    const majorityCount = votingRecord.votes.filter(v =>
      this.areResultsSimilar(v.result, votingRecord.majorityResult)
    ).length;

    const avgReputation =
      votingRecord.votes.reduce((sum, v) => sum + v.reputation, 0) /
      votingRecord.votes.length;

    const avgConfidence =
      votingRecord.votes.reduce((sum, v) => sum + v.confidence, 0) /
      votingRecord.votes.length;

    let consensusStrength: string;
    if (votingRecord.consensusConfidence >= 0.9) {
      consensusStrength = 'VERY_STRONG';
    } else if (votingRecord.consensusConfidence >= 0.75) {
      consensusStrength = 'STRONG';
    } else if (votingRecord.consensusConfidence >= 0.6) {
      consensusStrength = 'MODERATE';
    } else {
      consensusStrength = 'WEAK';
    }

    return {
      totalVoters: votingRecord.votes.length,
      majoritySize: majorityCount,
      minoritySize: votingRecord.votes.length - majorityCount,
      consensusStrength,
      avgReputation,
      avgConfidence
    };
  }
}
