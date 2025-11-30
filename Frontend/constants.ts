/**
 * Constants
 *
 * Re-exports from services for backward compatibility.
 * New code should import directly from services.
 */

import { MOCK_NODES, MOCK_LOGS } from "./services/mockData";

// Re-export for backward compatibility
export const INITIAL_NODES = MOCK_NODES;
export const INITIAL_LOGS = MOCK_LOGS;
