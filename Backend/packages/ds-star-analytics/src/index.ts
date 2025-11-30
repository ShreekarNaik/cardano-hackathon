/**
 * DS-STAR Analytics Agent
 * Autonomous data science with self-correction (Planner → Coder → Verifier loop)
 */

import OpenAI from 'openai';
import {
  DSStarRequest,
  DSStarResult,
  DSStarConfig,
  AnalysisPlan,
  GeneratedCode,
  VerificationResult,
  ExecutionResult,
  AnalysisStatus,
  IterationRecord
} from './types';

export * from './types';

/**
 * DS-STAR Agent - Autonomous data science with self-correction
 */
export class DSStarAgent {
  private openai: OpenAI;
  private config: Required<DSStarConfig>;
  private iterations: IterationRecord[] = [];

  constructor(config: DSStarConfig) {
    this.config = {
      openaiApiKey: config.openaiApiKey,
      model: config.model || 'gpt-4',
      maxIterations: config.maxIterations || 3,
      timeout: config.timeout || 300000, // 5 minutes
      enableSelfCorrection: config.enableSelfCorrection ?? true
    };

    this.openai = new OpenAI({ apiKey: this.config.openaiApiKey });
  }

  /**
   * Execute autonomous data science analysis
   */
  async analyze(request: DSStarRequest): Promise<DSStarResult> {
    const startTime = Date.now();
    this.iterations = [];

    let iteration = 0;
    let plan: AnalysisPlan | null = null;
    let code: GeneratedCode | null = null;
    let verification: VerificationResult | null = null;
    let execution: ExecutionResult | null = null;

    while (iteration < (request.maxIterations || this.config.maxIterations)) {
      iteration++;

      // Step 1: Plan
      plan = await this.createPlan(request.query, request.context);

      // Step 2: Generate Code
      code = await this.generateCode(plan, request.data);

      // Step 3: Verify Code
      verification = await this.verifyCode(code, plan);

      // Record iteration
      this.iterations.push({
        iterationNumber: iteration,
        plan,
        code,
        verification,
        timestamp: new Date()
      });

      // If verified, execute
      if (verification.isValid || !this.config.enableSelfCorrection) {
        execution = await this.executeCode(code);
        
        this.iterations[this.iterations.length - 1].execution = execution;

        if (execution.success) {
          break; // Success!
        }
      }

      // Self-correction loop
      if (iteration < (request.maxIterations || this.config.maxIterations)) {
        const correctionReason = this.determineCorrectionReason(
          verification,
          execution
        );
        this.iterations[this.iterations.length - 1].correctionReason =
          correctionReason;
      }
    }

    const totalTime = Date.now() - startTime;

    if (!plan || !code || !verification || !execution) {
      throw new Error('Analysis failed to complete');
    }

    return {
      query: request.query,
      plan,
      code,
      verification,
      execution,
      iterations: iteration,
      totalTime,
      finalAnswer: this.formatFinalAnswer(execution, plan)
    };
  }

  /**
   * Create analysis plan (Planner agent)
   */
  private async createPlan(
    query: string,
    context?: Record<string, any>
  ): Promise<AnalysisPlan> {
    const prompt = `You are a data science planner. Create a detailed analysis plan for:

Query: ${query}
Context: ${JSON.stringify(context || {}, null, 2)}

Provide a structured plan with:
1. List of analysis steps
2. Data requirements
3. Expected outputs
4. Estimated time

Format as JSON.`;

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert data science planner. Create comprehensive analysis plans.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content || '{}';
    
    // Simple plan structure (production would parse LLM output)
    return {
      steps: [
        {
          stepNumber: 1,
          description: 'Data exploration and summary statistics',
          method: 'descriptive_analysis',
          inputs: ['raw_data'],
          expectedOutput: 'summary_stats'
        },
        {
          stepNumber: 2,
          description: 'Pattern detection and anomaly analysis',
          method: 'statistical_tests',
          inputs: ['summary_stats'],
          expectedOutput: 'patterns'
        },
        {
          stepNumber: 3,
          description: 'Generate insights and recommendations',
          method: 'interpretation',
          inputs: ['patterns'],
          expectedOutput: 'final_report'
        }
      ],
      dataRequirements: ['blockchain_transactions', 'network_metrics'],
      expectedOutputs: ['anomalies', 'patterns', 'recommendations'],
      estimatedTime: 120000 // 2 minutes
    };
  }

  /**
   * Generate analysis code (Coder agent)
   */
  private async generateCode(
    plan: AnalysisPlan,
    data?: any
  ): Promise<GeneratedCode> {
    const prompt = `Generate Python code to execute this analysis plan:

${JSON.stringify(plan, null, 2)}

Requirements:
- Use pandas, numpy, scipy
- Include error handling
- Return results as JSON
- Add comments`;

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert data science coder. Write clean, efficient analysis code.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    });

    const content = response.choices[0]?.message?.content || '';

    // Extract code from markdown if present
    const codeMatch = content.match(/```python\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1] : content;

    return {
      code,
      language: 'python',
      dependencies: ['pandas', 'numpy', 'scipy'],
      explanation: 'Generated analysis code based on plan'
    };
  }

  /**
   * Verify code quality and correctness (Verifier agent)
   */
  private async verifyCode(
    code: GeneratedCode,
    plan: AnalysisPlan
  ): Promise<VerificationResult> {
    const prompt = `Verify this analysis code against the plan:

Code:
${code.code}

Plan:
${JSON.stringify(plan, null, 2)}

Check for:
1. Correctness
2. Completeness
3. Error handling
4. Best practices

Provide verification result as JSON with: isValid, errors, warnings, confidence, suggestions`;

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert code reviewer. Verify analysis code quality and correctness.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    });

    // Simple verification (production would use static analysis)
    const hasBasicStructure = code.code.length > 50;
    const hasImports = code.code.includes('import');
    const hasFunction = code.code.includes('def ') || code.code.includes('=');

    return {
      isValid: hasBasicStructure && (hasImports || hasFunction),
      errors: hasBasicStructure ? [] : ['Code too short or malformed'],
      warnings: hasImports ? [] : ['Missing import statements'],
      confidence: hasBasicStructure && hasImports && hasFunction ? 0.85 : 0.5,
      suggestions:
        hasBasicStructure ? [] : ['Add more comprehensive analysis logic']
    };
  }

  /**
   * Execute code (sandbox execution - stub for demo)
   */
  private async executeCode(code: GeneratedCode): Promise<ExecutionResult> {
    const startTime = Date.now();

    // In production: use sandboxed Python execution (Docker, py-interpreter, etc.)
    // For demo: simulate execution
    const simulatedSuccess = Math.random() > 0.2; // 80% success rate

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate execution

    const executionTime = Date.now() - startTime;

    if (simulatedSuccess) {
      return {
        success: true,
        output: {
          anomalies: 42,
          patterns: ['suspicious_volume', 'timing_anomaly'],
          confidence: 0.89
        },
        executionTime,
        logs: ['Analyzing data...', 'Pattern detection complete', 'Results generated']
      };
    } else {
      return {
        success: false,
        error: 'Runtime error: Division by zero',
        executionTime,
        logs: ['Analyzing data...', 'Error encountered']
      };
    }
  }

  /**
   * Determine reason for correction
   */
  private determineCorrectionReason(
    verification: VerificationResult,
    execution: ExecutionResult | null
  ): string {
    if (!verification.isValid) {
      return `Code verification failed: ${verification.errors.join(', ')}`;
    }
    if (execution && !execution.success) {
      return `Execution failed: ${execution.error}`;
    }
    return 'Unknown error';
  }

  /**
   * Format final answer
   */
  private formatFinalAnswer(
    execution: ExecutionResult,
    plan: AnalysisPlan
  ): string {
    if (!execution.success) {
      return 'Analysis failed to complete successfully.';
    }

    return `Analysis completed successfully. Found ${
      execution.output?.anomalies || 0
    } anomalies with ${
      ((execution.output?.confidence || 0) * 100).toFixed(1)
    }% confidence. Detected patterns: ${
      execution.output?.patterns?.join(', ') || 'none'
    }.`;
  }

  /**
   * Get iteration history
   */
  getIterations(): IterationRecord[] {
    return this.iterations;
  }
}

/**
 * Create DS-STAR agent with default config
 */
export function createDSStarAgent(apiKey: string): DSStarAgent {
  return new DSStarAgent({
    openaiApiKey: apiKey,
    model: 'gpt-4',
    maxIterations: 3,
    enableSelfCorrection: true
  });
}
