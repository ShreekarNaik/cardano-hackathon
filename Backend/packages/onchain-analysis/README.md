# On-Chain Analysis Pipeline

Cardano blockchain data collection, indexing, and real-time analytics using Ogmios and PostgreSQL/TimescaleDB.

## Overview

This package provides:
- **Ogmios Collector**: Real-time blockchain data streaming
- **Transaction Indexer**: Efficient data storage in TimescaleDB
- **Analytics Queries**: Pre-built queries for common metrics
- **Data Classification**: Smart contract interaction detection

## Features

- ✅ Real-time blockchain data collection via Ogmios
- ✅ High-performance storage with TimescaleDB
- ✅ Transaction classification (Payment, Smart Contract, Stake, Token)
- ✅ Time-series analytics ready
- ✅ Grafana dashboard integration

## Installation

```bash
npm install
```

## Configuration

Create `.env`:

```env
OGMIOS_URL=ws://localhost:1337
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=cardano_analytics
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

## Quick Start

### Start Data Collection

```bash
# Collect blockchain data
npm run collector

# Index transactions
npm run indexer
```

## Database Schema

### Transactions Table

```sql
CREATE TABLE transactions (
    tx_hash VARCHAR(64) PRIMARY KEY,
    block_height BIGINT NOT NULL,
    block_time TIMESTAMP NOT NULL,
    tx_type VARCHAR(20),
    input_count INT,
    output_count INT,
    total_input_ada BIGINT,
    total_output_ada BIGINT,
    fee_ada BIGINT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TimescaleDB hypertable
SELECT create_hypertable('transactions', 'block_time');
```

## Analytics Queries

### Transaction Volume

```sql
SELECT 
    time_bucket('1 hour', block_time) AS hour,
    COUNT(*) as tx_count,
    SUM(total_output_ada) / 1000000 as total_ada
FROM transactions
WHERE block_time > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```

### Transaction Classification

```sql
SELECT 
    tx_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM transactions
WHERE block_time > NOW() - INTERVAL '7 days'
GROUP BY tx_type;
```

## Integration

### With Backend API

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

// Query recent transactions
const result = await pool.query(`
  SELECT * FROM transactions 
  WHERE block_time > NOW() - INTERVAL '1 hour'
  ORDER BY block_time DESC
  LIMIT 100
`);
```

### With Grafana

1. Add PostgreSQL data source
2. Create dashboard with time-series panels
3. Use provided analytics queries

## Data Collection Flow

```
Cardano Node → Ogmios → Collector → PostgreSQL/TimescaleDB
                                          ↓
                                      Analytics
                                          ↓
                                    Grafana/API
```

## License

MIT
