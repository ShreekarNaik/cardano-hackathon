# DecentralAI Analytics - Cardano Smart Contracts

Aiken smart contracts for the DecentralAI Analytics platform on Cardano.

## Contracts

### 1. Data Ingestion Contract (`validators/data_ingestion.ak`)

Accepts and validates raw blockchain data submissions from authorized data sources.

**Features:**
- Timestamp validation (data < 1 hour old)
- Data source signature verification
- Data hash integrity (32 bytes)
- Update and cancellation support

**Use Cases:**
- On-chain data collection
- Batch data submissions
- Data source authentication

### 2. Analysis Results Contract (`validators/analysis_results.ak`)

Stores verified analysis results with quality metrics and multi-agent attestations.

**Features:**
- Quality scoring (0-100)
- Multi-agent verification
- MAKER workflow integration
- Result finalization (3+ verifications, quality ≥ 80)

**Use Cases:**
- Storing AI analysis results
- Multi-agent result validation
- Quality assurance tracking

### 3. Agent Registry Contract (`validators/agent_registry.ak`)

Manages registration and reputation of AI agents in the DecentralAI network.

**Features:**
- Agent registration with initial reputation (500/1000)
- Reputation updates based on performance
- Task completion tracking
- Verification success/failure tracking
- Agent suspension/reactivation
- Masumi network integration

**Agent Types:**
- CEO
- Research
- Coder
- Analytics
- Quality
- Operations
- Worker

## Building

### Prerequisites

- Aiken CLI v1.0+
- Git

### Install Aiken

```bash
# On Linux/macOS
curl --proto '=https' --tlsv1.2 -LsSf https://install.aiken-lang.org | sh

# Or with Homebrew
brew install aiken-lang/tap/aiken
```

### Build Contracts

```bash
cd packages/cardano-contracts

# Build all validators
aiken build

# Check for errors
aiken check

# Run tests
aiken check --tests
```

## Testing

Each contract includes placeholder tests. To run:

```bash
aiken check --tests
```

## Deployment

### Testnet Deployment

```bash
# From project root
npm run contracts:deploy:testnet
```

### Mainnet Deployment

```bash
# From project root
npm run contracts:deploy:mainnet
```

## Contract Addresses

After deployment, contract addresses will be stored in:
- `plutus.json` - Compiled Plutus scripts
- `artifacts/` - Blueprint and other build artifacts

## Integration

### With MeshJS

```typescript
import { MeshWallet } from '@meshsdk/core';
import dataIngestionBlueprint from './plutus.json';

// Initialize wallet
const wallet = new MeshWallet({ ... });

// Build transaction to interact with contract
// ... (see MeshJS docs)
```

### With Backend API

The backend API (`packages/backend-api`) provides REST endpoints to interact with these contracts:

- `POST /analysis/submit` - Submit analysis results
- `POST /agents/register` - Register new agent
- `POST /data/ingest` - Submit on-chain data

## Security Considerations

1. **Data Integrity**: All data hashes are 32 bytes (SHA-256)
2. **Authentication**: Required signatures for all state changes
3. **Timestamp Validation**: Prevents replay attacks and stale data
4. **Quality Thresholds**: Minimum 3 verifications and 80% quality for finalization
5. **Reputation System**: Tracks agent performance over time

## Development

### Adding New Validators

1. Create new `.ak` file in `validators/`
2. Define types: `Datum` and `Redeemer`
3. Implement `validator` function
4. Add tests
5. Build and check

### Code Style

- Use descriptive variable names
- Comment complex logic
- Include test cases
- Follow Aiken best practices

## Resources

- [Aiken Language Docs](https://aiken-lang.org/)
- [Cardano Developer Portal](https://developers.cardano.org/)
- [MeshJS Documentation](https://meshjs.dev/)
- [Implementation Guide](../../Implementation.md)

## License

MIT
