{
  "rootGraphId": "graph_main_architecture",
  "nodes": {
    "layer_user_client": {
      "id": "layer_user_client",
      "name": "User/Client Layer",
      "type": "component",
      "inputs": [],
      "outputs": [
        {"id": "user_requests", "label": "Analysis Requests"},
        {"id": "user_queries", "label": "Status Queries"}
      ],
      "content": {
        "type": "description",
        "value": "User-facing layer providing web dashboard, API clients, and mobile apps for interacting with the DecentralAI Analytics system"
      },
      "metadata": {
        "phase": "Phase 9",
        "status": "pending",
        "technologies": ["React", "TypeScript", "Vite"]
      },
      "graphId": "graph_user_client_layer",
      "parentId": "graph_main_architecture"
    },
    "layer_backend_api": {
      "id": "layer_backend_api",
      "name": "Backend API Layer",
      "type": "component",
      "inputs": [
        {"id": "api_requests", "label": "Client Requests"}
      ],
      "outputs": [
        {"id": "api_responses", "label": "API Responses"},
        {"id": "orchestration_commands", "label": "Orchestration Commands"}
      ],
      "content": {
        "type": "description",
        "value": "Express/Node.js + TypeScript API layer coordinating all system components"
      },
      "metadata": {
        "phase": "Phase 8",
        "status": "pending",
        "technologies": ["Express", "Node.js", "TypeScript"],
        "features": ["Agent Company Endpoints", "CEO Chat Interface"]
      },
      "graphId": "graph_backend_api_layer",
      "parentId": "graph_main_architecture"
    },
    "layer_agent_company": {
      "id": "layer_agent_company",
      "name": "AI Agent Company Layer",
      "type": "component",
      "inputs": [
        {"id": "company_requests", "label": "Analysis Requests (CEO Mode)"}
      ],
      "outputs": [
        {"id": "company_results", "label": "Verified Results"},
        {"id": "company_maker_tasks", "label": "Complex Tasks for MAKER"},
        {"id": "company_dsstar_tasks", "label": "Coding Tasks for DS-STAR"},
        {"id": "company_hydra_ops", "label": "Hydra Operations"}
      ],
      "content": {
        "type": "description",
        "value": "Hierarchical AI agent organization (CEO, Research, Coder, Analytics, Quality, Operations) that orchestrates analysis workflows in CEO mode and delegates to MAKER/DS-STAR/Hydra when needed"
      },
      "metadata": {
        "phase": "Phase 0",
        "status": "pending",
        "agents": 6,
        "dual_mode": true
      },
      "graphId": "graph_agent_company_layer",
      "parentId": "graph_main_architecture"
    },
    "layer_maker": {
      "id": "layer_maker",
      "name": "MAKER Layer",
      "type": "component",
      "inputs": [
        {"id": "maker_tasks", "label": "Analysis Tasks"}
      ],
      "outputs": [
        {"id": "maker_subtasks", "label": "Decomposed Subtasks"},
        {"id": "maker_verified_results", "label": "Verified Results"}
      ],
      "content": {
        "type": "description",
        "value": "Multi-Agent Task Decomposition & Orchestration - breaks down million-step tasks into manageable subtasks with error correction via multi-agent voting"
      },
      "metadata": {
        "phase": "Phase 4",
        "status": "pending",
        "paper": "arXiv:2511.09030",
        "key_innovation": "Zero errors at million-step scale",
        "integrated_with": ["CEO Agent", "Quality Agent"]
      },
      "graphId": "graph_maker_layer",
      "parentId": "graph_main_architecture"
    },
    "layer_masumi": {
      "id": "layer_masumi",
      "name": "Masumi Layer",
      "type": "component",
      "inputs": [
        {"id": "masumi_agent_registrations", "label": "Agent Registrations"},
        {"id": "masumi_payment_requests", "label": "Payment Requests"}
      ],
      "outputs": [
        {"id": "masumi_agent_identities", "label": "Agent DIDs"},
        {"id": "masumi_payments", "label": "Payment Settlements"}
      ],
      "content": {
        "type": "description",
        "value": "Decentralized AI agent infrastructure for identity management, discovery, payments, and collaboration on Cardano"
      },
      "metadata": {
        "phase": "Phase 3",
        "status": "pending",
        "network": "Cardano Preprod",
        "registry_policy": "e6c57104dfa95943ffab95eafe1f12ed9a8da791678bfbf765b05649"
      },
      "graphId": "graph_masumi_layer",
      "parentId": "graph_main_architecture"
    },
    "layer_hydra": {
      "id": "layer_hydra",
      "name": "Hydra L2 Layer",
      "type": "component",
      "inputs": [
        {"id": "hydra_agent_transactions", "label": "Agent Transactions"},
        {"id": "hydra_head_requests", "label": "Head Lifecycle Requests"}
      ],
      "outputs": [
        {"id": "hydra_fast_transactions", "label": "Fast Off-Chain Txs"},
        {"id": "hydra_settlement_data", "label": "Settlement Data"}
      ],
      "content": {
        "type": "description",
        "value": "Layer 2 scalability protocol using isomorphic state channels (Hydra Heads) for fast, low-cost off-chain agent coordination"
      },
      "metadata": {
        "phase": "Phase 5",
        "status": "pending",
        "version": "v1.0+",
        "mainnet_ready": true,
        "throughput": "~1000 TPS per Head"
      },
      "graphId": "graph_hydra_layer",
      "parentId": "graph_main_architecture"
    },
    "layer_dsstar": {
      "id": "layer_dsstar",
      "name": "DS-STAR Layer",
      "type": "component",
      "inputs": [
        {"id": "dsstar_analysis_tasks", "label": "Analysis Tasks"},
        {"id": "dsstar_blockchain_data", "label": "Blockchain Data"}
      ],
      "outputs": [
        {"id": "dsstar_analysis_results", "label": "Analysis Results"},
        {"id": "dsstar_generated_code", "label": "Generated Code"}
      ],
      "content": {
        "type": "description",
        "value": "Autonomous data science agent with LLM-based planning, code generation, and verification for Cardano blockchain analytics"
      },
      "metadata": {
        "phase": "Phase 6",
        "status": "pending",
        "paper": "arXiv:2509.21825",
        "language": "Python",
        "llm_model": "gpt-4.1 / gpt-4.1-mini",
        "integrated_with": ["Coder Agent"]
      },
      "graphId": "graph_dsstar_layer",
      "parentId": "graph_main_architecture"
    },
    "layer_cardano_l1": {
      "id": "layer_cardano_l1",
      "name": "Cardano L1 Layer",
      "type": "component",
      "inputs": [
        {"id": "cardano_transactions", "label": "Transactions"},
        {"id": "cardano_contract_calls", "label": "Contract Calls"}
      ],
      "outputs": [
        {"id": "cardano_confirmed_txs", "label": "Confirmed Transactions"},
        {"id": "cardano_blockchain_data", "label": "Blockchain Data"}
      ],
      "content": {
        "type": "description",
        "value": "Cardano mainnet - immutable base layer for settlement, smart contracts (Aiken), and final data storage"
      },
      "metadata": {
        "phase": "Phase 2",
        "status": "pending",
        "throughput": "~250 TPS",
        "block_time": "~20 seconds",
        "smart_contract_language": "Aiken"
      },
      "graphId": "graph_cardano_l1_layer",
      "parentId": "graph_main_architecture"
    },
    "layer_data_sources": {
      "id": "layer_data_sources",
      "name": "Data Sources Layer",
      "type": "component",
      "inputs": [
        {"id": "data_queries", "label": "Data Queries"}
      ],
      "outputs": [
        {"id": "data_blockchain_stream", "label": "Blockchain Data Stream"},
        {"id": "data_indexed_results", "label": "Indexed Query Results"}
      ],
      "content": {
        "type": "description",
        "value": "Data collection and indexing infrastructure using Ogmios, PostgreSQL/TimescaleDB, and on-chain data monitoring"
      },
      "metadata": {
        "phase": "Phase 7",
        "status": "pending",
        "technologies": ["Ogmios", "PostgreSQL", "TimescaleDB", "Grafana"]
      },
      "graphId": "graph_data_sources_layer",
      "parentId": "graph_main_architecture"
    },
    "user_web_dashboard": {
      "id": "user_web_dashboard",
      "name": "Web Dashboard",
      "type": "component",
      "inputs": [{"id": "user_input", "label": "User Input"}],
      "outputs": [{"id": "dashboard_requests", "label": "Dashboard Requests"}],
      "content": {
        "type": "code",
        "value": "React + TypeScript dashboard with pages for: Dashboard overview, Agent monitor, Analysis results, Hydra Head status, Metrics visualization, CEO Chat Interface, Agent Company Dashboard"
      },
      "metadata": {"framework": "React + Vite"},
      "graphId": null,
      "parentId": "graph_user_client_layer"
    },
    "user_api_clients": {
      "id": "user_api_clients",
      "name": "API Clients",
      "type": "component",
      "inputs": [{"id": "client_input", "label": "Client Commands"}],
      "outputs": [{"id": "client_requests", "label": "REST API Calls"}],
      "content": {"type": "text", "value": "Programmatic API clients for integration with external systems"},
      "metadata": {},
      "graphId": null,
      "parentId": "graph_user_client_layer"
    },
    "user_mobile_apps": {
      "id": "user_mobile_apps",
      "name": "Mobile Apps",
      "type": "component",
      "inputs": [{"id": "mobile_input", "label": "Mobile Input"}],
      "outputs": [{"id": "mobile_requests", "label": "Mobile Requests"}],
      "content": {"type": "text", "value": "Mobile interfaces for monitoring and basic operations"},
      "metadata": {"status": "future"},
      "graphId": null,
      "parentId": "graph_user_client_layer"
    },
    "backend_routes": {
      "id": "backend_routes",
      "name": "API Routes",
      "type": "component",
      "inputs": [{"id": "http_requests", "label": "HTTP Requests"}],
      "outputs": [{"id": "route_handlers", "label": "Route Handlers"}],
      "content": {
        "type": "code",
        "value": "Express routes:\n/analysis/start - Start new analysis\n/analysis/status - Check status\n/agents/list - List agents\n/results/query - Query results\n/metrics/dashboard - Get metrics\n/agent-company/chat - Chat with CEO Agent\n/agent-company/status - Agent company status\n/agent-company/metrics - Agent performance metrics"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_backend_api_layer"
    },
    "backend_services": {
      "id": "backend_services",
      "name": "Service Layer",
      "type": "component",
      "inputs": [{"id": "service_requests", "label": "Service Requests"}],
      "outputs": [{"id": "service_responses", "label": "Service Responses"}],
      "content": {
        "type": "text",
        "value": "Business logic services: AnalysisService, AgentService, HydraService, BlockchainService, DatabaseService"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_backend_api_layer"
    },
    "backend_middleware": {
      "id": "backend_middleware",
      "name": "Middleware",
      "type": "component",
      "inputs": [{"id": "incoming_requests", "label": "Incoming Requests"}],
      "outputs": [{"id": "processed_requests", "label": "Processed Requests"}],
      "content": {"type": "text", "value": "Authentication, error handling, logging, rate limiting"},
      "metadata": {},
      "graphId": null,
      "parentId": "graph_backend_api_layer"
    },
    "maker_task_decomposer": {
      "id": "maker_task_decomposer",
      "name": "Task Decomposer",
      "type": "process",
      "inputs": [{"id": "large_task", "label": "Million-Step Task"}],
      "outputs": [{"id": "subtasks", "label": "100 Subtasks"}],
      "content": {
        "type": "code",
        "value": "// Decomposes 1M-step analysis into N manageable subtasks\n// Example: 1M transactions -> 100 subtasks × 10K transactions each\nexport class TaskDecomposer {\n  decompose(task: Task, decompositionLevel: number): SubTask[] {\n    const chunkSize = task.dataSize / decompositionLevel;\n    const minVoters = 3; // 3 agents per subtask for voting\n    // Returns array of subtasks with assigned agents\n  }\n}"
      },
      "metadata": {"pattern": "Extreme decomposition"},
      "graphId": null,
      "parentId": "graph_maker_layer"
    },
    "maker_microagent_manager": {
      "id": "maker_microagent_manager",
      "name": "Microagent Manager",
      "type": "process",
      "inputs": [{"id": "subtasks_to_assign", "label": "Subtasks"}],
      "outputs": [{"id": "agent_assignments", "label": "Agent Assignments"}],
      "content": {
        "type": "text",
        "value": "Manages pool of microagents, assigns subtasks using round-robin, tracks agent status and reputation"
      },
      "metadata": {"assignment_strategy": "round-robin"},
      "graphId": null,
      "parentId": "graph_maker_layer"
    },
    "maker_error_corrector": {
      "id": "maker_error_corrector",
      "name": "Error Corrector",
      "type": "process",
      "inputs": [{"id": "agent_results", "label": "Multiple Agent Results"}],
      "outputs": [{"id": "verified_result", "label": "Verified Result"}],
      "content": {
        "type": "code",
        "value": "// Multi-agent voting for error correction\n// - Collect results from N agents (N >= 3)\n// - Hash-based result matching\n// - Majority wins\n// - Flag and penalize incorrect agents\nexport class ErrorCorrector {\n  async verifyWithVoting(subtask: SubTask, results: ExecutionResult[]): Promise<VerifiedResult> {\n    const resultGroups = this.groupByHash(results);\n    const [correctHash, voters] = this.findMajority(resultGroups);\n    return { correctOutput, votedAgents, incorrectAgents, confidence };\n  }\n}"
      },
      "metadata": {"voting_threshold": "majority"},
      "graphId": null,
      "parentId": "graph_maker_layer"
    },
    "maker_workflow_executor": {
      "id": "maker_workflow_executor",
      "name": "Workflow Executor",
      "type": "process",
      "inputs": [{"id": "execution_plan", "label": "Execution Plan"}],
      "outputs": [{"id": "final_results", "label": "Aggregated Results"}],
      "content": {
        "type": "text",
        "value": "Orchestrates end-to-end execution: decompose -> dispatch -> collect -> verify -> aggregate"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_maker_layer"
    },
    "masumi_registry_service": {
      "id": "masumi_registry_service",
      "name": "Registry Service",
      "type": "component",
      "inputs": [{"id": "agent_registration_request", "label": "Registration Request"}],
      "outputs": [{"id": "agent_did", "label": "Agent DID"}],
      "content": {
        "type": "text",
        "value": "Manages agent identity, generates DIDs (Decentralized Identifiers), tracks agent capabilities and reputation"
      },
      "metadata": {"policy_id": "e6c57104dfa95943ffab95eafe1f12ed9a8da791678bfbf765b05649"},
      "graphId": null,
      "parentId": "graph_masumi_layer"
    },
    "masumi_payment_service": {
      "id": "masumi_payment_service",
      "name": "Payment Service",
      "type": "component",
      "inputs": [{"id": "payment_request", "label": "Payment Request"}],
      "outputs": [{"id": "payment_tx", "label": "Payment Transaction"}],
      "content": {
        "type": "text",
        "value": "Handles micropayments between agents, creates agent wallets, manages payment settlement"
      },
      "metadata": {"contract_address": "addr_test1wp7je4555s7cdqvlcgdnkj34rrpryy8wsst9yvz7e74p2ugy69qgn"},
      "graphId": null,
      "parentId": "graph_masumi_layer"
    },
    "masumi_did_management": {
      "id": "masumi_did_management",
      "name": "DID Management",
      "type": "component",
      "inputs": [{"id": "did_request", "label": "DID Request"}],
      "outputs": [{"id": "did_credential", "label": "DID Credential"}],
      "content": {
        "type": "text",
        "value": "Decentralized identity management for agents - generates, verifies, and manages DIDs"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_masumi_layer"
    },
    "masumi_agent_discovery": {
      "id": "masumi_agent_discovery",
      "name": "Agent Discovery",
      "type": "component",
      "inputs": [{"id": "discovery_query", "label": "Discovery Query"}],
      "outputs": [{"id": "agent_list", "label": "Available Agents"}],
      "content": {
        "type": "text",
        "value": "Enables discovery of agents by capability, reputation, and availability"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_masumi_layer"
    },
    "hydra_head_manager": {
      "id": "hydra_head_manager",
      "name": "Head Manager",
      "type": "process",
      "inputs": [{"id": "head_lifecycle_request", "label": "Lifecycle Request"}],
      "outputs": [{"id": "head_handle", "label": "Head Handle"}],
      "content": {
        "type": "code",
        "value": "// Manages Hydra Head lifecycle: Init -> Open -> Active -> Close -> Finalize\nexport class HydraHeadManager {\n  async openHeadForAgents(agents: Agent[], fundAmount: BigInt): Promise<HeadHandle> {\n    // 1. Initialize Head with agent public keys\n    // 2. Fund Head from each agent\n    // 3. Wait for confirmation\n    // 4. Return Head reference for fast transactions\n  }\n  async closeHeadAndSettle(headId: string): Promise<TxHash> {\n    // Close Head and settle final state on Cardano L1\n  }\n}"
      },
      "metadata": {"protocol_version": "v1.0"},
      "graphId": null,
      "parentId": "graph_hydra_layer"
    },
    "hydra_transaction_router": {
      "id": "hydra_transaction_router",
      "name": "Transaction Router",
      "type": "process",
      "inputs": [{"id": "agent_tx", "label": "Agent Transaction"}],
      "outputs": [{"id": "routed_tx", "label": "Routed Transaction"}],
      "content": {
        "type": "text",
        "value": "Routes transactions to appropriate Hydra Heads based on agent group membership"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_hydra_layer"
    },
    "hydra_state_management": {
      "id": "hydra_state_management",
      "name": "State Management",
      "type": "component",
      "inputs": [{"id": "state_update", "label": "State Update"}],
      "outputs": [{"id": "confirmed_state", "label": "Confirmed State"}],
      "content": {
        "type": "text",
        "value": "Manages off-chain state within Hydra Heads, ensures consistency, handles snapshots"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_hydra_layer"
    },
    "hydra_lifecycle_controller": {
      "id": "hydra_lifecycle_controller",
      "name": "Lifecycle Controller",
      "type": "process",
      "inputs": [{"id": "lifecycle_event", "label": "Lifecycle Event"}],
      "outputs": [{"id": "lifecycle_state", "label": "Current State"}],
      "content": {
        "type": "text",
        "value": "Controls Head lifecycle transitions: Init -> Open -> Close -> Finalize, handles contestation period"
      },
      "metadata": {"contestation_period": "3600s"},
      "graphId": null,
      "parentId": "graph_hydra_layer"
    },
    "dsstar_planner": {
      "id": "dsstar_planner",
      "name": "Planner (LLM)",
      "type": "process",
      "inputs": [{"id": "dataset_description", "label": "Dataset Description"}],
      "outputs": [{"id": "analysis_plan", "label": "Analysis Plan"}],
      "content": {
        "type": "code",
        "value": "# LLM-based planning: understands dataset and creates analysis strategy using OpenAI\nfrom openai import OpenAI\n\nclass DSStarPlanner:\n    def __init__(self, model: str = \"gpt-4.1\"):\n        self.client = OpenAI()\n        self.model = model\n\n    def plan_analysis(self, dataset_description: str) -> Dict[str, Any]:\n        prompt = f\"\"\"\n        You are a Cardano blockchain data analyst.\n        Analyze this dataset and create a detailed plan:\n        {dataset_description}\n\n        Return JSON with:\n        - analysis_type: anomaly_detection|clustering|volume_analysis\n        - required_steps: [step1, step2, ...]\n        - queries_needed: [query1, query2, ...]\n        - expected_output: description\n        \"\"\"\n        response = self.client.chat.completions.create(\n            model=self.model,\n            messages=[{\"role\": \"user\", \"content\": prompt}],\n            temperature=0.2,\n        )\n        return json.loads(response.choices[0].message.content)"
      },
      "metadata": {"model": "gpt-4.1", "provider": "OpenAI"},
      "graphId": null,
      "parentId": "graph_dsstar_layer"
    },
    "dsstar_coder": {
      "id": "dsstar_coder",
      "name": "Coder (LLM)",
      "type": "process",
      "inputs": [{"id": "analysis_plan", "label": "Analysis Plan"}],
      "outputs": [{"id": "generated_code", "label": "Python Code"}],
      "content": {
        "type": "code",
        "value": "# LLM-based code generation: creates executable Python analysis code\ndef generate_code(self, plan: Dict[str, Any]) -> str:\n    prompt = f\"\"\"\n    Generate Python code to execute this analysis plan.\n    Use pandas, numpy, and SQL queries.\n    \n    Plan: {json.dumps(plan, indent=2)}\n    \n    Requirements:\n    - Handle large datasets efficiently\n    - Include error handling\n    - Return results as JSON\n    - Must be executable directly\n    \"\"\"\n    response = self.client.messages.create(...)\n    return cleaned_python_code"
      },
      "metadata": {"libraries": ["pandas", "numpy", "scikit-learn"]},
      "graphId": null,
      "parentId": "graph_dsstar_layer"
    },
    "dsstar_verifier": {
      "id": "dsstar_verifier",
      "name": "Verifier (LLM)",
      "type": "process",
      "inputs": [
        {"id": "plan_to_verify", "label": "Plan"},
        {"id": "results_to_verify", "label": "Results"}
      ],
      "outputs": [{"id": "verification_report", "label": "Verification Report"}],
      "content": {
        "type": "code",
        "value": "# LLM-based verification: validates results match plan\ndef verify_results(self, plan, code, results) -> Dict[str, Any]:\n    # Check:\n    # 1. Output format matches expected\n    # 2. No obvious errors or anomalies\n    # 3. Data types are correct\n    # 4. Statistical validity\n    return {\n        'is_valid': bool,\n        'confidence': float,\n        'issues': [],\n        'recommendations': []\n    }"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_dsstar_layer"
    },
    "dsstar_router": {
      "id": "dsstar_router",
      "name": "Router",
      "type": "process",
      "inputs": [{"id": "analysis_type", "label": "Analysis Type"}],
      "outputs": [{"id": "routed_handler", "label": "Handler Selection"}],
      "content": {
        "type": "text",
        "value": "Routes analysis requests to appropriate template or custom analysis handler"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_dsstar_layer"
    },
    "dsstar_data_processor": {
      "id": "dsstar_data_processor",
      "name": "Data Processor",
      "type": "component",
      "inputs": [{"id": "raw_blockchain_data", "label": "Raw Blockchain Data"}],
      "outputs": [{"id": "processed_data", "label": "Processed Data"}],
      "content": {
        "type": "text",
        "value": "Prepares Cardano blockchain data for analysis - parses transactions, extracts features, normalizes"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_dsstar_layer"
    },
    "cardano_smart_contracts": {
      "id": "cardano_smart_contracts",
      "name": "Smart Contracts",
      "type": "code",
      "inputs": [{"id": "contract_call", "label": "Contract Call"}],
      "outputs": [{"id": "contract_response", "label": "Contract Response"}],
      "content": {
        "type": "code",
        "value": "// Aiken smart contracts:\n// 1. Data Ingestion Contract - stores analysis requests\n// 2. Analysis Results Contract - stores verified results\n// 3. Agent Registry Contract - registers agents on-chain\n\nvalidator results_storage(result: ResultData) {\n  pub fn spend(datum: ResultData, redeemer, context) {\n    // Validate result integrity\n    // Check agent permissions\n    // Update on-chain state\n  }\n}"
      },
      "metadata": {"language": "Aiken", "contracts": 3},
      "graphId": "graph_cardano_contracts",
      "parentId": "graph_cardano_l1_layer"
    },
    "cardano_settlement": {
      "id": "cardano_settlement",
      "name": "Settlement Layer",
      "type": "component",
      "inputs": [{"id": "settlement_request", "label": "Settlement Request"}],
      "outputs": [{"id": "confirmed_settlement", "label": "Confirmed Settlement"}],
      "content": {
        "type": "text",
        "value": "Handles final settlement of Hydra Head states, payment distributions, result storage"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_cardano_l1_layer"
    },
    "cardano_blockchain_data": {
      "id": "cardano_blockchain_data",
      "name": "Blockchain Data",
      "type": "database",
      "inputs": [{"id": "write_data", "label": "Write Data"}],
      "outputs": [{"id": "read_data", "label": "Read Data"}],
      "content": {
        "type": "text",
        "value": "Immutable blockchain ledger storing all transactions, contract state, and historical data"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_cardano_l1_layer"
    },
    "contract_data_ingestion": {
      "id": "contract_data_ingestion",
      "name": "Data Ingestion Contract",
      "type": "code",
      "inputs": [{"id": "analysis_request_data", "label": "Analysis Request"}],
      "outputs": [{"id": "stored_request", "label": "On-Chain Request"}],
      "content": {
        "type": "code",
        "value": "// Stores analysis requests on-chain for transparency\npub type AnalysisRequest {\n  request_id: ByteArray,\n  requester: PubKeyHash,\n  dataset_hash: ByteArray,\n  parameters: ByteArray,\n  timestamp: Int,\n}"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_cardano_contracts"
    },
    "contract_analysis_results": {
      "id": "contract_analysis_results",
      "name": "Analysis Results Contract",
      "type": "code",
      "inputs": [{"id": "verified_analysis_result", "label": "Verified Result"}],
      "outputs": [{"id": "stored_result", "label": "On-Chain Result"}],
      "content": {
        "type": "code",
        "value": "// Stores verified analysis results immutably\npub type ResultData {\n  analysis_id: ByteArray,\n  agent_id: ByteArray,\n  result_hash: ByteArray,\n  timestamp: Int,\n  verified: Bool,\n}\n\nvalidator results_storage(result: ResultData) {\n  pub fn spend(datum, redeemer, context) {\n    // Validate result integrity\n    // Check agent permissions\n  }\n}"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_cardano_contracts"
    },
    "contract_agent_registry": {
      "id": "contract_agent_registry",
      "name": "Agent Registry Contract",
      "type": "code",
      "inputs": [{"id": "agent_registration", "label": "Agent Registration"}],
      "outputs": [{"id": "registered_agent", "label": "Registered Agent"}],
      "content": {
        "type": "code",
        "value": "// On-chain agent registry for transparency\npub type AgentRecord {\n  agent_id: ByteArray,\n  public_key: ByteArray,\n  capabilities: List<ByteArray>,\n  reputation_score: Int,\n  registration_tx: ByteArray,\n}"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_cardano_contracts"
    },
    "data_ogmios": {
      "id": "data_ogmios",
      "name": "Ogmios Collector",
      "type": "external",
      "inputs": [{"id": "blockchain_connection", "label": "Cardano Node Connection"}],
      "outputs": [{"id": "blockchain_stream", "label": "Transaction Stream"}],
      "content": {
        "type": "code",
        "value": "// Connects to Cardano node via Ogmios to fetch blockchain data\nimport { createInteractionContext } from '@cardano-ogmios/client';\n\nconst ogmios = await createInteractionContext(async () => ({\n  host: 'localhost',\n  port: 1337,\n}));\n\n// Collect transactions from slot range\nfor (let slot = fromSlot; slot < toSlot; slot++) {\n  const block = await ogmios.query.block.fromPoint({ slot, id: '' });\n  // Process transactions\n}"
      },
      "metadata": {"port": 1337},
      "graphId": null,
      "parentId": "graph_data_sources_layer"
    },
    "data_postgresql": {
      "id": "data_postgresql",
      "name": "PostgreSQL/TimescaleDB",
      "type": "database",
      "inputs": [{"id": "index_data", "label": "Data to Index"}],
      "outputs": [{"id": "query_results", "label": "Query Results"}],
      "content": {
        "type": "text",
        "value": "Indexes and stores Cardano blockchain data for fast queries - transactions, agent activities, analysis results"
      },
      "metadata": {"port": 5432, "tables": ["transactions", "agent_activities", "analysis_results"]},
      "graphId": null,
      "parentId": "graph_data_sources_layer"
    },
    "data_indexer": {
      "id": "data_indexer",
      "name": "Index Builder",
      "type": "process",
      "inputs": [{"id": "raw_tx_data", "label": "Raw Transaction Data"}],
      "outputs": [{"id": "indexed_data", "label": "Indexed Data"}],
      "content": {
        "type": "text",
        "value": "Processes raw blockchain data and builds searchable indexes - classifies transactions, extracts metadata"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_data_sources_layer"
    },
    "external_meshjs": {
      "id": "external_meshjs",
      "name": "MeshJS SDK",
      "type": "external",
      "inputs": [],
      "outputs": [{"id": "meshjs_api", "label": "Transaction Builder API"}],
      "content": {
        "type": "code",
        "value": "// MeshJS - All-in-one TypeScript SDK for Cardano\nimport { MeshWallet, Transaction, BlockfrostProvider } from '@meshsdk/core';\n\n// Create wallet\nconst wallet = new MeshWallet({\n  key: { type: 'mnemonic', words },\n  networkId: 0,\n  fetcher: provider,\n  submitter: provider,\n});\n\n// Build transaction\nconst tx = new Transaction({ initiator: wallet })\n  .sendLovelace({ address, datum }, '5000000')\n  .complete();\n\n// Sign and submit\nconst signedTx = await wallet.signTx(tx);\nconst txHash = await wallet.submitTx(signedTx);"
      },
      "metadata": {"version": "latest", "npm": "@meshsdk/core"},
      "graphId": null,
      "parentId": "graph_main_architecture"
    },
    "external_blockfrost": {
      "id": "external_blockfrost",
      "name": "Blockfrost API",
      "type": "external",
      "inputs": [],
      "outputs": [{"id": "blockfrost_data", "label": "Blockchain Data API"}],
      "content": {
        "type": "text",
        "value": "Cardano blockchain data provider - REST API for querying transactions, addresses, assets, metadata"
      },
      "metadata": {"url": "https://cardano-preprod.blockfrost.io/api/v0"},
      "graphId": null,
      "parentId": "graph_main_architecture"
    },
    "external_docker": {
      "id": "external_docker",
      "name": "Docker",
      "type": "external",
      "inputs": [],
      "outputs": [{"id": "containerization", "label": "Container Runtime"}],
      "content": {
        "type": "text",
        "value": "Container orchestration for all services - Hydra nodes, PostgreSQL, Ogmios, backend services"
      },
      "metadata": {"compose_version": "3.8"},
      "graphId": null,
      "parentId": "graph_main_architecture"
    },
    "external_openai": {
      "id": "external_openai",
      "name": "OpenAI API",
      "type": "external",
      "inputs": [],
      "outputs": [{"id": "llm_responses", "label": "LLM Responses"}],
      "content": {
        "type": "text",
        "value": "OpenAI API for DS-STAR agent planning, code generation, verification, and CEO Agent orchestration"
      },
      "metadata": {
        "provider": "OpenAI",
        "models": ["gpt-4.1", "gpt-4.1-mini"],
        "used_by": ["DS-STAR Layer", "CEO Agent"]
      },
      "graphId": null,
      "parentId": "graph_main_architecture"
    },
    "agent_company_ceo": {
      "id": "agent_company_ceo",
      "name": "CEO Agent",
      "type": "component",
      "inputs": [
        {"id": "ceo_requests", "label": "User / API Requests"},
        {"id": "ceo_context", "label": "Context & Metrics"}
      ],
      "outputs": [
        {"id": "ceo_tasks", "label": "Delegated Tasks"},
        {"id": "ceo_results", "label": "Final Orchestrated Result"}
      ],
      "content": {
        "type": "code",
        "value": "# CEOAgent orchestrates company agents and delegates to MAKER for complex tasks\nclass CEOAgent:\n    async def process_user_request(self, request: str) -> dict:\n        analysis = await self.analyze_request(request)\n        if analysis.get('use_maker'):\n            return await self.delegate_to_maker(request, analysis)\n        return await self.delegate_to_agents(request, analysis)"
      },
      "metadata": {
        "role": "orchestrator",
        "llm_model": "gpt-4.1",
        "entrypoint": "packages/agent-company/src/ceo_agent.py"
      },
      "graphId": null,
      "parentId": "graph_agent_company_layer"
    },
    "agent_company_research": {
      "id": "agent_company_research",
      "name": "Research Agent",
      "type": "component",
      "inputs": [
        {"id": "research_tasks", "label": "Research Tasks"}
      ],
      "outputs": [
        {"id": "research_findings", "label": "Findings & Sources"}
      ],
      "content": {
        "type": "text",
        "value": "Performs web research, gathers Cardano and market data, and summarizes context for other agents using web search and data fetch tools"
      },
      "metadata": {
        "role": "research",
        "entrypoint": "packages/agent-company/src/research_agent.py"
      },
      "graphId": null,
      "parentId": "graph_agent_company_layer"
    },
    "agent_company_coder": {
      "id": "agent_company_coder",
      "name": "Coder Agent",
      "type": "component",
      "inputs": [
        {"id": "coder_tasks", "label": "Coding / Analysis Tasks"},
        {"id": "coder_data", "label": "Prepared Data"}
      ],
      "outputs": [
        {"id": "coder_results", "label": "Execution Results"},
        {"id": "coder_code", "label": "Generated Code"}
      ],
      "content": {
        "type": "text",
        "value": "Uses DS-STAR inside an isolated Docker container to plan, generate, execute, and verify data analysis code for Cardano analytics"
      },
      "metadata": {
        "role": "coding",
        "dockerized": true,
        "entrypoint": "packages/agent-company/src/coder_agent.py"
      },
      "graphId": null,
      "parentId": "graph_agent_company_layer"
    },
    "agent_company_analytics": {
      "id": "agent_company_analytics",
      "name": "Analytics Agent",
      "type": "component",
      "inputs": [
        {"id": "analytics_inputs", "label": "Data & Intermediate Results"}
      ],
      "outputs": [
        {"id": "analytics_report", "label": "Analysis Report"}
      ],
      "content": {
        "type": "text",
        "value": "Performs statistical analysis, creates visualizations, and compiles analytic reports over aggregated results"
      },
      "metadata": {
        "role": "analytics",
        "entrypoint": "packages/agent-company/src/analytics_agent.py"
      },
      "graphId": null,
      "parentId": "graph_agent_company_layer"
    },
    "agent_company_quality": {
      "id": "agent_company_quality",
      "name": "Quality Agent",
      "type": "component",
      "inputs": [
        {"id": "quality_inputs", "label": "Results to Verify"}
      ],
      "outputs": [
        {"id": "quality_verified_results", "label": "Verified Results"}
      ],
      "content": {
        "type": "text",
        "value": "Uses MAKER-style multi-agent voting and ErrorCorrector to validate outputs and assign confidence scores"
      },
      "metadata": {
        "role": "quality",
        "entrypoint": "packages/agent-company/src/quality_agent.py"
      },
      "graphId": null,
      "parentId": "graph_agent_company_layer"
    },
    "agent_company_operations": {
      "id": "agent_company_operations",
      "name": "Operations Agent",
      "type": "component",
      "inputs": [
        {"id": "ops_commands", "label": "Ops & Deployment Commands"}
      ],
      "outputs": [
        {"id": "ops_status", "label": "Deployment & Monitoring Status"}
      ],
      "content": {
        "type": "text",
        "value": "Manages infrastructure, monitors agents, and coordinates Hydra Heads and on-chain settlement for large-scale analyses"
      },
      "metadata": {
        "role": "operations",
        "entrypoint": "packages/agent-company/src/operations_agent.py"
      },
      "graphId": null,
      "parentId": "graph_agent_company_layer"
    },
    "phase_0": {
      "id": "phase_0",
      "name": "Phase 0: AI Agent Company Setup",
      "type": "process",
      "inputs": [],
      "outputs": [{"id": "agent_company_ready", "label": "Agent Company Ready"}],
      "content": {
        "type": "text",
        "value": "Week 1: Implement 6-agent company (CEO, Research, Coder, Analytics, Quality, Operations), Dockerized coder environment, and core tests"
      },
      "metadata": {"duration": "1 week", "status": "pending", "deliverable": "AI Agent Company package"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_1": {
      "id": "phase_1",
      "name": "Phase 1: Foundation Setup",
      "type": "process",
      "inputs": [{"id": "agent_company", "label": "Agent Company Ready"}],
      "outputs": [{"id": "foundation_complete", "label": "Infrastructure Ready"}],
      "content": {
        "type": "text",
        "value": "Weeks 2-3: Repository setup, monorepo structure, Docker compose, git submodules, local development environment"
      },
      "metadata": {"duration": "2 weeks", "status": "pending"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_2": {
      "id": "phase_2",
      "name": "Phase 2: Smart Contracts & L1",
      "type": "process",
      "inputs": [{"id": "foundation_done", "label": "Foundation"}],
      "outputs": [{"id": "contracts_deployed", "label": "Contracts Deployed"}],
      "content": {
        "type": "text",
        "value": "Weeks 4-5: Develop Aiken smart contracts (3 types), deploy to testnet, MeshJS off-chain integration, PostgreSQL schema"
      },
      "metadata": {"duration": "2 weeks", "status": "pending", "deliverable": "3 smart contracts on testnet"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_3": {
      "id": "phase_3",
      "name": "Phase 3: Masumi Integration",
      "type": "process",
      "inputs": [{"id": "contracts_ready", "label": "Smart Contracts"}],
      "outputs": [{"id": "masumi_ready", "label": "Masumi Infrastructure"}],
      "content": {
        "type": "text",
        "value": "Weeks 6-7: Masumi Quickstart deployment, agent registration service, payment service, DID management, agent discovery"
      },
      "metadata": {"duration": "2 weeks", "status": "pending"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_4": {
      "id": "phase_4",
      "name": "Phase 4: MAKER Framework + CEO Integration",
      "type": "process",
      "inputs": [{"id": "masumi_infrastructure", "label": "Agent Infrastructure"}],
      "outputs": [{"id": "maker_ready", "label": "MAKER Orchestration"}],
      "content": {
        "type": "text",
        "value": "Weeks 8-9: Task decomposer, microagent manager, multi-agent voting/error correction, workflow executor, CEO integration tests"
      },
      "metadata": {"duration": "2 weeks", "status": "pending", "key_innovation": "Zero-error million-step execution"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_5": {
      "id": "phase_5",
      "name": "Phase 5: Hydra Layer 2",
      "type": "process",
      "inputs": [{"id": "maker_orchestration", "label": "MAKER Framework"}],
      "outputs": [{"id": "hydra_ready", "label": "Hydra L2 Running"}],
      "content": {
        "type": "text",
        "value": "Weeks 10-11: Hydra node configuration, Head lifecycle management, transaction routing, settlement mechanism, performance testing"
      },
      "metadata": {"duration": "2 weeks", "status": "pending"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_6": {
      "id": "phase_6",
      "name": "Phase 6: DS-STAR + Coder Agent Integration",
      "type": "process",
      "inputs": [{"id": "hydra_layer", "label": "Hydra Infrastructure"}],
      "outputs": [{"id": "dsstar_ready", "label": "DS-STAR Analytics"}],
      "content": {
        "type": "text",
        "value": "Weeks 12-13: DS-STAR Planner, Coder, Verifier, Router, analysis templates (volume, anomaly, clustering) integrated with Coder Agent and Docker execution environment"
      },
      "metadata": {"duration": "2 weeks", "status": "pending"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_7": {
      "id": "phase_7",
      "name": "Phase 7: On-Chain Analysis",
      "type": "process",
      "inputs": [{"id": "all_layers", "label": "All Core Layers"}],
      "outputs": [{"id": "monitoring_ready", "label": "Monitoring Active"}],
      "content": {
        "type": "text",
        "value": "Weeks 14-15: Data collector (Ogmios), index builder (PostgreSQL), metrics calculator, anomaly detector, Grafana dashboards"
      },
      "metadata": {"duration": "2 weeks", "status": "pending"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_8": {
      "id": "phase_8",
      "name": "Phase 8: Backend API + CEO Chat Interface",
      "type": "process",
      "inputs": [{"id": "all_services", "label": "All Services"}],
      "outputs": [{"id": "api_ready", "label": "Unified API"}],
      "content": {
        "type": "text",
        "value": "Weeks 16-17: Express.js API routes (including Agent Company endpoints), service layer integration, database service, error handling, logging"
      },
      "metadata": {"duration": "2 weeks", "status": "pending"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_9": {
      "id": "phase_9",
      "name": "Phase 9: Frontend Dashboard + Agent Monitoring",
      "type": "process",
      "inputs": [{"id": "backend_api", "label": "Backend API"}],
      "outputs": [{"id": "frontend_ready", "label": "Web Dashboard"}],
      "content": {
        "type": "text",
        "value": "Weeks 18-19: React + Vite setup, Dashboard page, Agent monitor, Results viewer, Metrics charts, CEO Chat interface, Agent Company dashboard, integration with API"
      },
      "metadata": {"duration": "2 weeks", "status": "pending"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "phase_10": {
      "id": "phase_10",
      "name": "Phase 10: Testing & Deployment",
      "type": "process",
      "inputs": [{"id": "complete_system", "label": "Complete System"}],
      "outputs": [{"id": "production_ready", "label": "Production Deployment"}],
      "content": {
        "type": "text",
        "value": "Weeks 20-21: Unit tests, integration tests, E2E tests, testnet deployment, load testing (1M transaction analysis), mainnet preparation"
      },
      "metadata": {"duration": "2 weeks", "status": "pending", "deliverable": "Production-ready system"},
      "graphId": null,
      "parentId": "graph_implementation_roadmap"
    },
    "example_user_request": {
      "id": "example_user_request",
      "name": "User Request",
      "type": "actor",
      "inputs": [],
      "outputs": [{"id": "analysis_request", "label": "Analyze 1M Transactions"}],
      "content": {
        "type": "text",
        "value": "User submits: 'Analyze 1 million Cardano transactions for anomalies'"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_example_million_step"
    },
    "example_decomposition": {
      "id": "example_decomposition",
      "name": "MAKER Decomposition",
      "type": "process",
      "inputs": [{"id": "million_tx_request", "label": "1M Transactions"}],
      "outputs": [{"id": "hundred_subtasks", "label": "100 Subtasks"}],
      "content": {
        "type": "text",
        "value": "MAKER decomposes 1M transactions into 100 subtasks of 10K transactions each. Each subtask assigned to 3 agents for voting."
      },
      "metadata": {"subtasks": 100, "agents_per_subtask": 3, "total_executions": 300},
      "graphId": null,
      "parentId": "graph_example_million_step"
    },
    "example_hydra_heads": {
      "id": "example_hydra_heads",
      "name": "Hydra Heads Created",
      "type": "process",
      "inputs": [{"id": "agent_groups", "label": "Agent Groups"}],
      "outputs": [{"id": "active_heads", "label": "10 Active Heads"}],
      "content": {
        "type": "text",
        "value": "300 agents grouped into 10 Hydra Heads (30 agents per head) for fast off-chain coordination"
      },
      "metadata": {"heads": 10, "agents_per_head": 30},
      "graphId": null,
      "parentId": "graph_example_million_step"
    },
    "example_parallel_execution": {
      "id": "example_parallel_execution",
      "name": "Parallel DS-STAR Execution",
      "type": "process",
      "inputs": [{"id": "subtasks_distributed", "label": "Distributed Subtasks"}],
      "outputs": [{"id": "raw_results", "label": "300 Raw Results"}],
      "content": {
        "type": "text",
        "value": "All 300 agent instances execute DS-STAR analysis in parallel within Hydra Heads - each analyzes 10K transactions"
      },
      "metadata": {"parallel_executions": 300},
      "graphId": null,
      "parentId": "graph_example_million_step"
    },
    "example_voting": {
      "id": "example_voting",
      "name": "Multi-Agent Voting",
      "type": "process",
      "inputs": [{"id": "three_results_per_subtask", "label": "3 Results per Subtask"}],
      "outputs": [{"id": "verified_results", "label": "100 Verified Results"}],
      "content": {
        "type": "text",
        "value": "For each subtask, 3 agent results are compared via hash-based voting. Majority wins. Incorrect agents penalized."
      },
      "metadata": {"voting_mechanism": "hash-based majority"},
      "graphId": null,
      "parentId": "graph_example_million_step"
    },
    "example_aggregation": {
      "id": "example_aggregation",
      "name": "Result Aggregation",
      "type": "process",
      "inputs": [{"id": "hundred_verified", "label": "100 Verified Results"}],
      "outputs": [{"id": "final_analysis", "label": "Final Analysis Report"}],
      "content": {
        "type": "text",
        "value": "MAKER aggregates 100 verified subtask results into final comprehensive analysis report"
      },
      "metadata": {},
      "graphId": null,
      "parentId": "graph_example_million_step"
    },
    "example_settlement": {
      "id": "example_settlement",
      "name": "Cardano L1 Settlement",
      "type": "process",
      "inputs": [{"id": "final_report", "label": "Final Report"}],
      "outputs": [{"id": "onchain_txhash", "label": "Transaction Hash"}],
      "content": {
        "type": "text",
        "value": "Final results submitted to Cardano smart contract, Hydra Heads closed, payments settled, immutable on-chain record created"
      },
      "metadata": {"immutable": true},
      "graphId": null,
      "parentId": "graph_example_million_step"
    }
  },
  "graphs": {
    "graph_main_architecture": {
      "id": "graph_main_architecture",
      "nodes": [
        "layer_user_client",
        "layer_backend_api",
        "layer_agent_company",
        "layer_maker",
        "layer_masumi",
        "layer_hydra",
        "layer_dsstar",
        "layer_cardano_l1",
        "layer_data_sources",
        "external_meshjs",
        "external_blockfrost",
        "external_docker",
        "external_openai"
      ],
      "edges": [
        "edge_user_to_backend",
        "edge_backend_to_agent_company",
        "edge_backend_to_maker",
        "edge_backend_to_masumi",
        "edge_maker_to_masumi",
        "edge_maker_to_hydra",
        "edge_masumi_to_hydra",
        "edge_hydra_to_dsstar",
        "edge_dsstar_to_cardano",
        "edge_hydra_to_cardano",
        "edge_cardano_to_data",
        "edge_data_to_dsstar",
        "edge_backend_to_data",
        "edge_external_meshjs_to_backend",
        "edge_external_blockfrost_to_backend",
        "edge_external_docker_all",
        "edge_external_openai_to_dsstar",
        "edge_agent_company_to_maker",
        "edge_agent_company_to_dsstar",
        "edge_agent_company_to_hydra"
      ],
      "metadata": {
        "description": "DecentralAI Analytics - Main System Architecture (with AI Agent Company)",
        "version": "3.0",
        "total_phases": 11
      }
    },
    "graph_user_client_layer": {
      "id": "graph_user_client_layer",
      "nodes": [
        "user_web_dashboard",
        "user_api_clients",
        "user_mobile_apps"
      ],
      "edges": [
        "edge_dashboard_to_api",
        "edge_clients_to_api",
        "edge_mobile_to_api"
      ],
      "metadata": {
        "layer": "User Interface",
        "phase": "Phase 9"
      }
    },
    "graph_backend_api_layer": {
      "id": "graph_backend_api_layer",
      "nodes": [
        "backend_routes",
        "backend_services",
        "backend_middleware"
      ],
      "edges": [
        "edge_middleware_to_routes",
        "edge_routes_to_services"
      ],
      "metadata": {
        "layer": "API Gateway",
        "phase": "Phase 8"
      }
    },
    "graph_maker_layer": {
      "id": "graph_maker_layer",
      "nodes": [
        "maker_task_decomposer",
        "maker_microagent_manager",
        "maker_error_corrector",
        "maker_workflow_executor"
      ],
      "edges": [
        "edge_decomposer_to_manager",
        "edge_manager_to_executor",
        "edge_executor_to_corrector",
        "edge_corrector_to_executor"
      ],
      "metadata": {
        "layer": "Orchestration",
        "phase": "Phase 4",
        "paper": "arXiv:2511.09030"
      }
    },
    "graph_masumi_layer": {
      "id": "graph_masumi_layer",
      "nodes": [
        "masumi_registry_service",
        "masumi_payment_service",
        "masumi_did_management",
        "masumi_agent_discovery"
      ],
      "edges": [
        "edge_registry_to_did",
        "edge_registry_to_discovery",
        "edge_payment_to_registry"
      ],
      "metadata": {
        "layer": "Agent Infrastructure",
        "phase": "Phase 3"
      }
    },
    "graph_hydra_layer": {
      "id": "graph_hydra_layer",
      "nodes": [
        "hydra_head_manager",
        "hydra_transaction_router",
        "hydra_state_management",
        "hydra_lifecycle_controller"
      ],
      "edges": [
        "edge_manager_to_lifecycle",
        "edge_router_to_state",
        "edge_lifecycle_to_state"
      ],
      "metadata": {
        "layer": "Layer 2 Scaling",
        "phase": "Phase 5",
        "protocol_version": "v1.0"
      }
    },
    "graph_dsstar_layer": {
      "id": "graph_dsstar_layer",
      "nodes": [
        "dsstar_planner",
        "dsstar_coder",
        "dsstar_verifier",
        "dsstar_router",
        "dsstar_data_processor"
      ],
      "edges": [
        "edge_planner_to_coder",
        "edge_coder_to_verifier",
        "edge_router_to_planner",
        "edge_processor_to_planner"
      ],
      "metadata": {
        "layer": "Analytics Engine",
        "phase": "Phase 6",
        "paper": "arXiv:2509.21825"
      }
    },
    "graph_agent_company_layer": {
      "id": "graph_agent_company_layer",
      "nodes": [
        "agent_company_ceo",
        "agent_company_research",
        "agent_company_coder",
        "agent_company_analytics",
        "agent_company_quality",
        "agent_company_operations"
      ],
      "edges": [
        "edge_ceo_to_research",
        "edge_ceo_to_coder",
        "edge_ceo_to_analytics",
        "edge_ceo_to_quality",
        "edge_ceo_to_operations",
        "edge_research_to_coder",
        "edge_research_to_analytics",
        "edge_coder_to_analytics",
        "edge_coder_to_quality",
        "edge_analytics_to_quality",
        "edge_quality_to_ceo",
        "edge_operations_to_ceo"
      ],
      "metadata": {
        "layer": "AI Agent Company",
        "phase": "Phase 0",
        "description": "6-agent company (CEO, Research, Coder, Analytics, Quality, Operations) with CEO-orchestrated and MAKER-powered modes"
      }
    },
    "graph_cardano_l1_layer": {
      "id": "graph_cardano_l1_layer",
      "nodes": [
        "cardano_smart_contracts",
        "cardano_settlement",
        "cardano_blockchain_data"
      ],
      "edges": [
        "edge_contracts_to_settlement",
        "edge_settlement_to_blockchain"
      ],
      "metadata": {
        "layer": "Base Layer",
        "phase": "Phase 2"
      }
    },
    "graph_cardano_contracts": {
      "id": "graph_cardano_contracts",
      "nodes": [
        "contract_data_ingestion",
        "contract_analysis_results",
        "contract_agent_registry"
      ],
      "edges": [],
      "metadata": {
        "language": "Aiken",
        "total_contracts": 3
      }
    },
    "graph_data_sources_layer": {
      "id": "graph_data_sources_layer",
      "nodes": [
        "data_ogmios",
        "data_postgresql",
        "data_indexer"
      ],
      "edges": [
        "edge_ogmios_to_indexer",
        "edge_indexer_to_postgresql"
      ],
      "metadata": {
        "layer": "Data Infrastructure",
        "phase": "Phase 7"
      }
    },
    "graph_implementation_roadmap": {
      "id": "graph_implementation_roadmap",
      "nodes": [
        "phase_0",
        "phase_1",
        "phase_2",
        "phase_3",
        "phase_4",
        "phase_5",
        "phase_6",
        "phase_7",
        "phase_8",
        "phase_9",
        "phase_10"
      ],
      "edges": [
        "edge_phase0_to_phase1",
        "edge_phase1_to_phase2",
        "edge_phase2_to_phase3",
        "edge_phase3_to_phase4",
        "edge_phase4_to_phase5",
        "edge_phase5_to_phase6",
        "edge_phase6_to_phase7",
        "edge_phase7_to_phase8",
        "edge_phase8_to_phase9",
        "edge_phase9_to_phase10"
      ],
      "metadata": {
        "total_duration": "21 weeks",
        "type": "Sequential workflow"
      }
    },
    "graph_example_million_step": {
      "id": "graph_example_million_step",
      "nodes": [
        "example_user_request",
        "example_decomposition",
        "example_hydra_heads",
        "example_parallel_execution",
        "example_voting",
        "example_aggregation",
        "example_settlement"
      ],
      "edges": [
        "edge_example_request_to_decomp",
        "edge_example_decomp_to_heads",
        "edge_example_heads_to_execution",
        "edge_example_execution_to_voting",
        "edge_example_voting_to_aggregation",
        "edge_example_aggregation_to_settlement"
      ],
      "metadata": {
        "description": "Concrete example: 1M transaction anomaly detection",
        "total_transactions": 1000000,
        "subtasks": 100,
        "agents": 300,
        "hydra_heads": 10
      }
    }
  },
  "edges": {
    "edge_user_to_backend": {
      "id": "edge_user_to_backend",
      "source": "layer_user_client",
      "sourcePort": "user_requests",
      "target": "layer_backend_api",
      "targetPort": "api_requests",
      "label": "Analysis Requests",
      "metadata": {"flow_type": "analysis_flow", "protocol": "HTTPS"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_backend_to_agent_company": {
      "id": "edge_backend_to_agent_company",
      "source": "layer_backend_api",
      "sourcePort": "orchestration_commands",
      "target": "layer_agent_company",
      "targetPort": "company_requests",
      "label": "CEO-Orchestrated Requests",
      "metadata": {"flow_type": "analysis_flow", "mode": "CEO"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_backend_to_maker": {
      "id": "edge_backend_to_maker",
      "source": "layer_backend_api",
      "sourcePort": "orchestration_commands",
      "target": "layer_maker",
      "targetPort": "maker_tasks",
      "label": "Task Orchestration",
      "metadata": {"flow_type": "analysis_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_backend_to_masumi": {
      "id": "edge_backend_to_masumi",
      "source": "layer_backend_api",
      "sourcePort": "orchestration_commands",
      "target": "layer_masumi",
      "targetPort": "masumi_agent_registrations",
      "label": "Agent Management",
      "metadata": {"flow_type": "transaction_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_agent_company_to_maker": {
      "id": "edge_agent_company_to_maker",
      "source": "layer_agent_company",
      "sourcePort": "company_maker_tasks",
      "target": "layer_maker",
      "targetPort": "maker_tasks",
      "label": "Complex Task Delegation",
      "metadata": {"flow_type": "analysis_flow", "mode": "MAKER"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_agent_company_to_dsstar": {
      "id": "edge_agent_company_to_dsstar",
      "source": "layer_agent_company",
      "sourcePort": "company_dsstar_tasks",
      "target": "layer_dsstar",
      "targetPort": "dsstar_analysis_tasks",
      "label": "Coder Agent DS-STAR Tasks",
      "metadata": {"flow_type": "analysis_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_agent_company_to_hydra": {
      "id": "edge_agent_company_to_hydra",
      "source": "layer_agent_company",
      "sourcePort": "company_hydra_ops",
      "target": "layer_hydra",
      "targetPort": "hydra_head_requests",
      "label": "Hydra Operations",
      "metadata": {"flow_type": "control_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_maker_to_masumi": {
      "id": "edge_maker_to_masumi",
      "source": "layer_maker",
      "sourcePort": "maker_subtasks",
      "target": "layer_masumi",
      "targetPort": "masumi_agent_registrations",
      "label": "Microagent Registration",
      "metadata": {"flow_type": "transaction_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_maker_to_hydra": {
      "id": "edge_maker_to_hydra",
      "source": "layer_maker",
      "sourcePort": "maker_subtasks",
      "target": "layer_hydra",
      "targetPort": "hydra_head_requests",
      "label": "Subtask Distribution",
      "metadata": {"flow_type": "analysis_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_masumi_to_hydra": {
      "id": "edge_masumi_to_hydra",
      "source": "layer_masumi",
      "sourcePort": "masumi_agent_identities",
      "target": "layer_hydra",
      "targetPort": "hydra_head_requests",
      "label": "Agent Identities",
      "metadata": {"flow_type": "transaction_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_hydra_to_dsstar": {
      "id": "edge_hydra_to_dsstar",
      "source": "layer_hydra",
      "sourcePort": "hydra_fast_transactions",
      "target": "layer_dsstar",
      "targetPort": "dsstar_analysis_tasks",
      "label": "Analysis Tasks (Off-Chain)",
      "metadata": {"flow_type": "analysis_flow", "latency": "near-instant"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_dsstar_to_cardano": {
      "id": "edge_dsstar_to_cardano",
      "source": "layer_dsstar",
      "sourcePort": "dsstar_analysis_results",
      "target": "layer_cardano_l1",
      "targetPort": "cardano_contract_calls",
      "label": "Result Storage (via Hydra)",
      "metadata": {"flow_type": "transaction_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_hydra_to_cardano": {
      "id": "edge_hydra_to_cardano",
      "source": "layer_hydra",
      "sourcePort": "hydra_settlement_data",
      "target": "layer_cardano_l1",
      "targetPort": "cardano_transactions",
      "label": "Settlement & Finalization",
      "metadata": {"flow_type": "payment_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_cardano_to_data": {
      "id": "edge_cardano_to_data",
      "source": "layer_cardano_l1",
      "sourcePort": "cardano_blockchain_data",
      "target": "layer_data_sources",
      "targetPort": "data_queries",
      "label": "Blockchain Data Stream",
      "metadata": {"flow_type": "data_collection_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_data_to_dsstar": {
      "id": "edge_data_to_dsstar",
      "source": "layer_data_sources",
      "sourcePort": "data_indexed_results",
      "target": "layer_dsstar",
      "targetPort": "dsstar_blockchain_data",
      "label": "Indexed Blockchain Data",
      "metadata": {"flow_type": "data_collection_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_backend_to_data": {
      "id": "edge_backend_to_data",
      "source": "layer_backend_api",
      "sourcePort": "api_responses",
      "target": "layer_data_sources",
      "targetPort": "data_queries",
      "label": "Query Results",
      "metadata": {"flow_type": "data_collection_flow"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_external_meshjs_to_backend": {
      "id": "edge_external_meshjs_to_backend",
      "source": "external_meshjs",
      "sourcePort": "meshjs_api",
      "target": "layer_backend_api",
      "targetPort": "api_requests",
      "label": "Transaction Builder SDK",
      "metadata": {"dependency": "npm package"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_external_blockfrost_to_backend": {
      "id": "edge_external_blockfrost_to_backend",
      "source": "external_blockfrost",
      "sourcePort": "blockfrost_data",
      "target": "layer_backend_api",
      "targetPort": "api_requests",
      "label": "Blockchain Data API",
      "metadata": {"dependency": "API service"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_external_docker_all": {
      "id": "edge_external_docker_all",
      "source": "external_docker",
      "sourcePort": "containerization",
      "target": "layer_backend_api",
      "targetPort": "api_requests",
      "label": "Container Orchestration",
      "metadata": {"scope": "all services"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_external_openai_to_dsstar": {
      "id": "edge_external_openai_to_dsstar",
      "source": "external_openai",
      "sourcePort": "llm_responses",
      "target": "layer_dsstar",
      "targetPort": "dsstar_analysis_tasks",
      "label": "LLM API",
      "metadata": {"dependency": "API service"},
      "containerGraphId": "graph_main_architecture"
    },
    "edge_dashboard_to_api": {
      "id": "edge_dashboard_to_api",
      "source": "user_web_dashboard",
      "sourcePort": "dashboard_requests",
      "target": "backend_routes",
      "targetPort": "http_requests",
      "label": "REST API Calls",
      "metadata": {},
      "containerGraphId": "graph_user_client_layer"
    },
    "edge_clients_to_api": {
      "id": "edge_clients_to_api",
      "source": "user_api_clients",
      "sourcePort": "client_requests",
      "target": "backend_routes",
      "targetPort": "http_requests",
      "label": "Programmatic API",
      "metadata": {},
      "containerGraphId": "graph_user_client_layer"
    },
    "edge_mobile_to_api": {
      "id": "edge_mobile_to_api",
      "source": "user_mobile_apps",
      "sourcePort": "mobile_requests",
      "target": "backend_routes",
      "targetPort": "http_requests",
      "label": "Mobile API",
      "metadata": {},
      "containerGraphId": "graph_user_client_layer"
    },
    "edge_middleware_to_routes": {
      "id": "edge_middleware_to_routes",
      "source": "backend_middleware",
      "sourcePort": "processed_requests",
      "target": "backend_routes",
      "targetPort": "http_requests",
      "label": "Validated Requests",
      "metadata": {},
      "containerGraphId": "graph_backend_api_layer"
    },
    "edge_routes_to_services": {
      "id": "edge_routes_to_services",
      "source": "backend_routes",
      "sourcePort": "route_handlers",
      "target": "backend_services",
      "targetPort": "service_requests",
      "label": "Service Calls",
      "metadata": {},
      "containerGraphId": "graph_backend_api_layer"
    },
    "edge_decomposer_to_manager": {
      "id": "edge_decomposer_to_manager",
      "source": "maker_task_decomposer",
      "sourcePort": "subtasks",
      "target": "maker_microagent_manager",
      "targetPort": "subtasks_to_assign",
      "label": "Subtask Assignment",
      "metadata": {},
      "containerGraphId": "graph_maker_layer"
    },
    "edge_manager_to_executor": {
      "id": "edge_manager_to_executor",
      "source": "maker_microagent_manager",
      "sourcePort": "agent_assignments",
      "target": "maker_workflow_executor",
      "targetPort": "execution_plan",
      "label": "Execution Plan",
      "metadata": {},
      "containerGraphId": "graph_maker_layer"
    },
    "edge_executor_to_corrector": {
      "id": "edge_executor_to_corrector",
      "source": "maker_workflow_executor",
      "sourcePort": "final_results",
      "target": "maker_error_corrector",
      "targetPort": "agent_results",
      "label": "Raw Results",
      "metadata": {},
      "containerGraphId": "graph_maker_layer"
    },
    "edge_corrector_to_executor": {
      "id": "edge_corrector_to_executor",
      "source": "maker_error_corrector",
      "sourcePort": "verified_result",
      "target": "maker_workflow_executor",
      "targetPort": "execution_plan",
      "label": "Verified Results",
      "metadata": {},
      "containerGraphId": "graph_maker_layer"
    },
    "edge_registry_to_did": {
      "id": "edge_registry_to_did",
      "source": "masumi_registry_service",
      "sourcePort": "agent_did",
      "target": "masumi_did_management",
      "targetPort": "did_request",
      "label": "DID Generation",
      "metadata": {},
      "containerGraphId": "graph_masumi_layer"
    },
    "edge_registry_to_discovery": {
      "id": "edge_registry_to_discovery",
      "source": "masumi_registry_service",
      "sourcePort": "agent_did",
      "target": "masumi_agent_discovery",
      "targetPort": "discovery_query",
      "label": "Agent Catalog",
      "metadata": {},
      "containerGraphId": "graph_masumi_layer"
    },
    "edge_payment_to_registry": {
      "id": "edge_payment_to_registry",
      "source": "masumi_payment_service",
      "sourcePort": "payment_tx",
      "target": "masumi_registry_service",
      "targetPort": "agent_registration_request",
      "label": "Payment Verification",
      "metadata": {},
      "containerGraphId": "graph_masumi_layer"
    },
    "edge_manager_to_lifecycle": {
      "id": "edge_manager_to_lifecycle",
      "source": "hydra_head_manager",
      "sourcePort": "head_handle",
      "target": "hydra_lifecycle_controller",
      "targetPort": "lifecycle_event",
      "label": "Head Control",
      "metadata": {},
      "containerGraphId": "graph_hydra_layer"
    },
    "edge_router_to_state": {
      "id": "edge_router_to_state",
      "source": "hydra_transaction_router",
      "sourcePort": "routed_tx",
      "target": "hydra_state_management",
      "targetPort": "state_update",
      "label": "State Updates",
      "metadata": {},
      "containerGraphId": "graph_hydra_layer"
    },
    "edge_lifecycle_to_state": {
      "id": "edge_lifecycle_to_state",
      "source": "hydra_lifecycle_controller",
      "sourcePort": "lifecycle_state",
      "target": "hydra_state_management",
      "targetPort": "state_update",
      "label": "Lifecycle State",
      "metadata": {},
      "containerGraphId": "graph_hydra_layer"
    },
    "edge_planner_to_coder": {
      "id": "edge_planner_to_coder",
      "source": "dsstar_planner",
      "sourcePort": "analysis_plan",
      "target": "dsstar_coder",
      "targetPort": "analysis_plan",
      "label": "Execution Plan",
      "metadata": {},
      "containerGraphId": "graph_dsstar_layer"
    },
    "edge_coder_to_verifier": {
      "id": "edge_coder_to_verifier",
      "source": "dsstar_coder",
      "sourcePort": "generated_code",
      "target": "dsstar_verifier",
      "targetPort": "plan_to_verify",
      "label": "Code + Results",
      "metadata": {},
      "containerGraphId": "graph_dsstar_layer"
    },
    "edge_router_to_planner": {
      "id": "edge_router_to_planner",
      "source": "dsstar_router",
      "sourcePort": "routed_handler",
      "target": "dsstar_planner",
      "targetPort": "dataset_description",
      "label": "Routed Task",
      "metadata": {},
      "containerGraphId": "graph_dsstar_layer"
    },
    "edge_processor_to_planner": {
      "id": "edge_processor_to_planner",
      "source": "dsstar_data_processor",
      "sourcePort": "processed_data",
      "target": "dsstar_planner",
      "targetPort": "dataset_description",
      "label": "Prepared Data",
      "metadata": {},
      "containerGraphId": "graph_dsstar_layer"
    },
    "edge_research_to_coder": {
      "id": "edge_research_to_coder",
      "source": "agent_company_research",
      "sourcePort": "research_findings",
      "target": "agent_company_coder",
      "targetPort": "coder_data",
      "label": "Pass Findings to Coder",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_research_to_analytics": {
      "id": "edge_research_to_analytics",
      "source": "agent_company_research",
      "sourcePort": "research_findings",
      "target": "agent_company_analytics",
      "targetPort": "analytics_inputs",
      "label": "Pass Findings to Analytics",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_ceo_to_research": {
      "id": "edge_ceo_to_research",
      "source": "agent_company_ceo",
      "sourcePort": "ceo_tasks",
      "target": "agent_company_research",
      "targetPort": "research_tasks",
      "label": "Delegate Research Tasks",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_ceo_to_coder": {
      "id": "edge_ceo_to_coder",
      "source": "agent_company_ceo",
      "sourcePort": "ceo_tasks",
      "target": "agent_company_coder",
      "targetPort": "coder_tasks",
      "label": "Delegate Coding Tasks",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_ceo_to_analytics": {
      "id": "edge_ceo_to_analytics",
      "source": "agent_company_ceo",
      "sourcePort": "ceo_tasks",
      "target": "agent_company_analytics",
      "targetPort": "analytics_inputs",
      "label": "Delegate Analytics Tasks",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_ceo_to_quality": {
      "id": "edge_ceo_to_quality",
      "source": "agent_company_ceo",
      "sourcePort": "ceo_results",
      "target": "agent_company_quality",
      "targetPort": "quality_inputs",
      "label": "Send Results for Verification",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_ceo_to_operations": {
      "id": "edge_ceo_to_operations",
      "source": "agent_company_ceo",
      "sourcePort": "ceo_tasks",
      "target": "agent_company_operations",
      "targetPort": "ops_commands",
      "label": "Ops & Deployment Commands",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_coder_to_analytics": {
      "id": "edge_coder_to_analytics",
      "source": "agent_company_coder",
      "sourcePort": "coder_results",
      "target": "agent_company_analytics",
      "targetPort": "analytics_inputs",
      "label": "Analysis Outputs",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_coder_to_quality": {
      "id": "edge_coder_to_quality",
      "source": "agent_company_coder",
      "sourcePort": "coder_results",
      "target": "agent_company_quality",
      "targetPort": "quality_inputs",
      "label": "Raw Results for Verification",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_analytics_to_quality": {
      "id": "edge_analytics_to_quality",
      "source": "agent_company_analytics",
      "sourcePort": "analytics_report",
      "target": "agent_company_quality",
      "targetPort": "quality_inputs",
      "label": "Report for Verification",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_quality_to_ceo": {
      "id": "edge_quality_to_ceo",
      "source": "agent_company_quality",
      "sourcePort": "quality_verified_results",
      "target": "agent_company_ceo",
      "targetPort": "ceo_results",
      "label": "Verified Final Result",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_operations_to_ceo": {
      "id": "edge_operations_to_ceo",
      "source": "agent_company_operations",
      "sourcePort": "ops_status",
      "target": "agent_company_ceo",
      "targetPort": "ceo_context",
      "label": "Ops Status & Metrics",
      "metadata": {},
      "containerGraphId": "graph_agent_company_layer"
    },
    "edge_contracts_to_settlement": {
      "id": "edge_contracts_to_settlement",
      "source": "cardano_smart_contracts",
      "sourcePort": "contract_response",
      "target": "cardano_settlement",
      "targetPort": "settlement_request",
      "label": "Contract Execution",
      "metadata": {},
      "containerGraphId": "graph_cardano_l1_layer"
    },
    "edge_settlement_to_blockchain": {
      "id": "edge_settlement_to_blockchain",
      "source": "cardano_settlement",
      "sourcePort": "confirmed_settlement",
      "target": "cardano_blockchain_data",
      "targetPort": "write_data",
      "label": "Immutable Storage",
      "metadata": {},
      "containerGraphId": "graph_cardano_l1_layer"
    },
    "edge_ogmios_to_indexer": {
      "id": "edge_ogmios_to_indexer",
      "source": "data_ogmios",
      "sourcePort": "blockchain_stream",
      "target": "data_indexer",
      "targetPort": "raw_tx_data",
      "label": "Transaction Stream",
      "metadata": {},
      "containerGraphId": "graph_data_sources_layer"
    },
    "edge_indexer_to_postgresql": {
      "id": "edge_indexer_to_postgresql",
      "source": "data_indexer",
      "sourcePort": "indexed_data",
      "target": "data_postgresql",
      "targetPort": "index_data",
      "label": "Indexed Records",
      "metadata": {},
      "containerGraphId": "graph_data_sources_layer"
    },
    "edge_phase0_to_phase1": {
      "id": "edge_phase0_to_phase1",
      "source": "phase_0",
      "sourcePort": "agent_company_ready",
      "target": "phase_1",
      "targetPort": "agent_company",
      "label": "Agent Company Ready",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase1_to_phase2": {
      "id": "edge_phase1_to_phase2",
      "source": "phase_1",
      "sourcePort": "foundation_complete",
      "target": "phase_2",
      "targetPort": "foundation_done",
      "label": "Foundation Complete",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase2_to_phase3": {
      "id": "edge_phase2_to_phase3",
      "source": "phase_2",
      "sourcePort": "contracts_deployed",
      "target": "phase_3",
      "targetPort": "contracts_ready",
      "label": "Contracts Deployed",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase3_to_phase4": {
      "id": "edge_phase3_to_phase4",
      "source": "phase_3",
      "sourcePort": "masumi_ready",
      "target": "phase_4",
      "targetPort": "masumi_infrastructure",
      "label": "Masumi Ready",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase4_to_phase5": {
      "id": "edge_phase4_to_phase5",
      "source": "phase_4",
      "sourcePort": "maker_ready",
      "target": "phase_5",
      "targetPort": "maker_orchestration",
      "label": "MAKER Ready",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase5_to_phase6": {
      "id": "edge_phase5_to_phase6",
      "source": "phase_5",
      "sourcePort": "hydra_ready",
      "target": "phase_6",
      "targetPort": "hydra_layer",
      "label": "Hydra Ready",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase6_to_phase7": {
      "id": "edge_phase6_to_phase7",
      "source": "phase_6",
      "sourcePort": "dsstar_ready",
      "target": "phase_7",
      "targetPort": "all_layers",
      "label": "DS-STAR Ready",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase7_to_phase8": {
      "id": "edge_phase7_to_phase8",
      "source": "phase_7",
      "sourcePort": "monitoring_ready",
      "target": "phase_8",
      "targetPort": "all_services",
      "label": "Monitoring Ready",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase8_to_phase9": {
      "id": "edge_phase8_to_phase9",
      "source": "phase_8",
      "sourcePort": "api_ready",
      "target": "phase_9",
      "targetPort": "backend_api",
      "label": "API Ready",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_phase9_to_phase10": {
      "id": "edge_phase9_to_phase10",
      "source": "phase_9",
      "sourcePort": "frontend_ready",
      "target": "phase_10",
      "targetPort": "complete_system",
      "label": "Frontend Ready",
      "metadata": {"dependency": "sequential"},
      "containerGraphId": "graph_implementation_roadmap"
    },
    "edge_example_request_to_decomp": {
      "id": "edge_example_request_to_decomp",
      "source": "example_user_request",
      "sourcePort": "analysis_request",
      "target": "example_decomposition",
      "targetPort": "million_tx_request",
      "label": "1M Transaction Task",
      "metadata": {"flow_type": "example_flow"},
      "containerGraphId": "graph_example_million_step"
    },
    "edge_example_decomp_to_heads": {
      "id": "edge_example_decomp_to_heads",
      "source": "example_decomposition",
      "sourcePort": "hundred_subtasks",
      "target": "example_hydra_heads",
      "targetPort": "agent_groups",
      "label": "100 Subtasks",
      "metadata": {"flow_type": "example_flow"},
      "containerGraphId": "graph_example_million_step"
    },
    "edge_example_heads_to_execution": {
      "id": "edge_example_heads_to_execution",
      "source": "example_hydra_heads",
      "sourcePort": "active_heads",
      "target": "example_parallel_execution",
      "targetPort": "subtasks_distributed",
      "label": "Distributed to Heads",
      "metadata": {"flow_type": "example_flow"},
      "containerGraphId": "graph_example_million_step"
    },
    "edge_example_execution_to_voting": {
      "id": "edge_example_execution_to_voting",
      "source": "example_parallel_execution",
      "sourcePort": "raw_results",
      "target": "example_voting",
      "targetPort": "three_results_per_subtask",
      "label": "300 Results (3 per subtask)",
      "metadata": {"flow_type": "example_flow"},
      "containerGraphId": "graph_example_million_step"
    },
    "edge_example_voting_to_aggregation": {
      "id": "edge_example_voting_to_aggregation",
      "source": "example_voting",
      "sourcePort": "verified_results",
      "target": "example_aggregation",
      "targetPort": "hundred_verified",
      "label": "100 Verified Results",
      "metadata": {"flow_type": "example_flow"},
      "containerGraphId": "graph_example_million_step"
    },
    "edge_example_aggregation_to_settlement": {
      "id": "edge_example_aggregation_to_settlement",
      "source": "example_aggregation",
      "sourcePort": "final_analysis",
      "target": "example_settlement",
      "targetPort": "final_report",
      "label": "Complete Analysis",
      "metadata": {"flow_type": "example_flow"},
      "containerGraphId": "graph_example_million_step"
    }
  }
}
