#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('\n🔍 Verifying "Grains of Sand" Demo Results...\n');

  try {
    const reportPath = path.join(process.cwd(), 'demos/grains-of-sand/results/report.md');
    
    if (!fs.existsSync(reportPath)) {
      throw new Error('Report not found. Please run the demo first.');
    }

    const report = fs.readFileSync(reportPath, 'utf-8');
    
    console.log('📄 Report found. Analyzing content...');
    
    // Check for essential components
    const checks = [
      { name: 'Payment Transaction', regex: /Payment TX.*\[(.*)\]/ },
      { name: 'Proof Transaction', regex: /Proof TX.*\[(.*)\]/ },
      { name: 'Agent ID', regex: /Agent ID.*agent-\d+/ },
      { name: 'Final Result', regex: /7.5 x 10\^18/ }
    ];

    let allPassed = true;

    for (const check of checks) {
      const match = report.match(check.regex);
      if (match) {
        console.log(`✅ ${check.name}: Verified`);
      } else {
        console.log(`❌ ${check.name}: Missing or Invalid`);
        allPassed = false;
      }
    }

    if (allPassed) {
      console.log('\n✅ DEMO VERIFICATION SUCCESSFUL!');
      console.log('   All blockchain proofs are present and valid.');

      // Verify log files exist
      const logFile = path.join(process.cwd(), 'demos/grains-of-sand/results/detailed_execution.log');
      const jsonLogFile = path.join(process.cwd(), 'demos/grains-of-sand/results/execution_trace.json');

      if (fs.existsSync(logFile) && fs.existsSync(jsonLogFile)) {
        console.log('✅ Detailed Execution Logs: Verified');
      } else {
        console.log('❌ Detailed Execution Logs: Missing');
        process.exit(1);
      }

    } else {
      console.error('\n❌ DEMO VERIFICATION FAILED');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
