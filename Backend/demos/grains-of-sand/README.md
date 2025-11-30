# Grains of Sand Demo

This demo showcases a decentralized AI agent company solving a complex estimation problem: **"Estimate how many grains of sand are there on Earth?"**

The entire workflow is verifiable on the Cardano Preprod Testnet.

## Workflow

1.  **User Query**: A user submits the query to the Agent Company.
2.  **Payment**: The user pays the estimated cost in ADA via Masumi Network.
3.  **Task Decomposition**: The CEO Agent breaks down the task into sub-tasks (e.g., "Estimate total beach length", "Estimate average beach width", "Estimate sand density").
4.  **Worker Execution**: Specialized agents execute sub-tasks.
5.  **Aggregation**: The CEO Agent aggregates results and formulates the final answer.
6.  **Verification**: All steps are recorded on-chain.

## Running the Demo

```bash
pnpm run demo:grains-of-sand
```

## Verification

After running the demo, a verification report is generated in `results/report.md`. You can verify the transactions on the Cardano Preprod Explorer.
