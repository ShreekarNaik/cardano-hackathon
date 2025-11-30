import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import {
  MAKERTask,
  Subtask,
  SubtaskStatus,
  TaskStatus,
  DecompositionConfig,
  DecompositionResult
} from './types';

/**
 * Task Decomposer
 * Decomposes large tasks into manageable subtasks using LLM
 * Based on MAKER framework (arXiv:2511.09030)
 */
export class TaskDecomposer {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4-turbo-preview') {
    this.openai = new OpenAI({ apiKey });
    this.model = model;
  }

  /**
   * Decompose a task into subtasks
   */
  async decompose(
    taskDescription: string,
    config: DecompositionConfig
  ): Promise<DecompositionResult> {
    const taskId = uuidv4();

    // Use LLM to intelligently decompose the task
    const subtasks = await this.generateSubtasks(
      taskId,
      taskDescription,
      config
    );

    // Identify dependencies between subtasks
    const dependencies = await this.identifyDependencies(subtasks);

    // Estimate execution duration
    const estimatedDuration = this.estimateDuration(subtasks, config);

    return {
      taskId,
      totalSteps: config.totalSteps,
      subtasks,
      dependencies,
      estimatedDuration
    };
  }

  /**
   * Create a MAKER task from decomposition result
   */
  createTask(
    description: string,
    decompositionResult: DecompositionResult,
    config: DecompositionConfig
  ): MAKERTask {
    return {
      id: decompositionResult.taskId,
      description,
      totalSteps: config.totalSteps,
      config,
      subtasks: decompositionResult.subtasks,
      status: TaskStatus.CREATED,
      metadata: {
        estimatedDuration: decompositionResult.estimatedDuration,
        createdAt: new Date().toISOString()
      }
    };
  }

  /**
   * Generate subtasks using LLM
   */
  private async generateSubtasks(
    taskId: string,
    taskDescription: string,
    config: DecompositionConfig
  ): Promise<Subtask[]> {
    const prompt = `
You are a task decomposition expert for the MAKER framework.

Task: "${taskDescription}"
Total Steps: ${config.totalSteps}
Number of Subtasks: ${config.subtasksCount}

Break this task into exactly ${config.subtasksCount} subtasks.

Each subtask should:
1. Cover a specific range of steps
2. Be independently executable
3. Have a clear description
4. Be roughly equal in complexity

Provide a JSON array of subtasks:
[
  {
    "index": 0,
    "startStep": 0,
    "endStep": X,
    "description": "..."
  },
  ...
]

Ensure:
- Steps are consecutive and complete (0 to ${config.totalSteps})
- Each subtask has a clear, actionable description
- Subtasks can be executed in parallel where possible
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from LLM');
      }

      const parsed = JSON.parse(content);
      const subtasksData = Array.isArray(parsed) ? parsed : parsed.subtasks;

      return subtasksData.map(
        (st: any): Subtask => ({
          id: uuidv4(),
          taskId,
          index: st.index,
          startStep: st.startStep,
          endStep: st.endStep,
          description: st.description,
          dependencies: [],
          status: SubtaskStatus.PENDING,
          assignedAgents: [],
          results: [],
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );
    } catch (error: any) {
      console.error('Error generating subtasks:', error);

      // Fallback: simple linear decomposition
      return this.createLinearDecomposition(taskId, taskDescription, config);
    }
  }

  /**
   * Fallback: Create simple linear decomposition
   */
  private createLinearDecomposition(
    taskId: string,
    taskDescription: string,
    config: DecompositionConfig
  ): Subtask[] {
    const stepsPerSubtask = Math.ceil(
      config.totalSteps / config.subtasksCount
    );
    const subtasks: Subtask[] = [];

    for (let i = 0; i < config.subtasksCount; i++) {
      const startStep = i * stepsPerSubtask;
      const endStep = Math.min(
        (i + 1) * stepsPerSubtask - 1,
        config.totalSteps - 1
      );

      subtasks.push({
        id: uuidv4(),
        taskId,
        index: i,
        startStep,
        endStep,
        description: `${taskDescription} - Part ${i + 1} (steps ${startStep}-${endStep})`,
        dependencies: i > 0 ? [subtasks[i - 1].id] : [],
        status: SubtaskStatus.PENDING,
        assignedAgents: [],
        results: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return subtasks;
  }

  /**
   * Identify dependencies between subtasks using LLM
   */
  private async identifyDependencies(
    subtasks: Subtask[]
  ): Promise<Map<string, string[]>> {
    const dependencies = new Map<string, string[]>();

    // Initialize with empty arrays
    subtasks.forEach(st => dependencies.set(st.id, []));

    // For small numbers of subtasks, use LLM to identify dependencies
    if (subtasks.length <= 20) {
      try {
        const prompt = `
Analyze these subtasks and identify dependencies:

${subtasks.map((st, i) => `${i}. ${st.description} (steps ${st.startStep}-${st.endStep})`).join('\n')}

Which subtasks must be completed before others can start?

Provide JSON:
{
  "dependencies": [
    { "subtask": <index>, "dependsOn": [<indices>] },
    ...
  ]
}
`;

        const response = await this.openai.chat.completions.create({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.2
        });

        const content = response.choices[0].message.content;
        if (content) {
          const parsed = JSON.parse(content);
          parsed.dependencies?.forEach((dep: any) => {
            const subtask = subtasks[dep.subtask];
            if (subtask) {
              const deps = dep.dependsOn
                .map((idx: number) => subtasks[idx]?.id)
                .filter(Boolean);
              dependencies.set(subtask.id, deps);
              subtask.dependencies = deps;
            }
          });
        }
      } catch (error) {
        console.error('Error identifying dependencies:', error);
        // Fall back to sequential dependencies
        this.createSequentialDependencies(subtasks, dependencies);
      }
    } else {
      // For large numbers, assume mostly sequential
      this.createSequentialDependencies(subtasks, dependencies);
    }

    return dependencies;
  }

  /**
   * Create sequential dependencies (each depends on previous)
   */
  private createSequentialDependencies(
    subtasks: Subtask[],
    dependencies: Map<string, string[]>
  ): void {
    for (let i = 1; i < subtasks.length; i++) {
      const deps = [subtasks[i - 1].id];
      dependencies.set(subtasks[i].id, deps);
      subtasks[i].dependencies = deps;
    }
  }

  /**
   * Estimate total execution duration
   */
  private estimateDuration(
    subtasks: Subtask[],
    config: DecompositionConfig
  ): number {
    // Estimate based on:
    // - Number of subtasks
    // - Steps per subtask
    // - Parallelism
    // - Timeout per subtask

    const avgStepsPerSubtask =
      subtasks.reduce((sum, st) => sum + (st.endStep - st.startStep + 1), 0) /
      subtasks.length;

    // Assume some subtasks can run in parallel
    const parallelBatches = Math.ceil(subtasks.length / config.parallelism);

    // Each batch takes timeout + voting time + aggregation
    const batchTime =
      config.timeoutPerSubtask + 5000 + // Voting
      2000; // Aggregation

    return parallelBatches * batchTime;
  }

  /**
   * Validate decomposition
   */
  validateDecomposition(result: DecompositionResult): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check step coverage
    const coveredSteps = new Set<number>();
    result.subtasks.forEach(st => {
      for (let i = st.startStep; i <= st.endStep; i++) {
        if (coveredSteps.has(i)) {
          errors.push(`Step ${i} covered by multiple subtasks`);
        }
        coveredSteps.add(i);
      }
    });

    if (coveredSteps.size !== result.totalSteps) {
      errors.push(
        `Step coverage incomplete: ${coveredSteps.size}/${result.totalSteps}`
      );
    }

    // Check dependency validity
    const subtaskIds = new Set(result.subtasks.map(st => st.id));
    result.subtasks.forEach(st => {
      st.dependencies.forEach(depId => {
        if (!subtaskIds.has(depId)) {
          errors.push(`Invalid dependency: ${depId} for subtask ${st.id}`);
        }
      });
    });

    // Check for circular dependencies
    if (this.hasCircularDependencies(result.subtasks)) {
      errors.push('Circular dependencies detected');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check for circular dependencies
   */
  private hasCircularDependencies(subtasks: Subtask[]): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (subtaskId: string): boolean => {
      visited.add(subtaskId);
      recursionStack.add(subtaskId);

      const subtask = subtasks.find(st => st.id === subtaskId);
      if (!subtask) return false;

      for (const depId of subtask.dependencies) {
        if (!visited.has(depId)) {
          if (dfs(depId)) return true;
        } else if (recursionStack.has(depId)) {
          return true;
        }
      }

      recursionStack.delete(subtaskId);
      return false;
    };

    for (const subtask of subtasks) {
      if (!visited.has(subtask.id)) {
        if (dfs(subtask.id)) return true;
      }
    }

    return false;
  }
}
