import process from 'node:process';

import { runChecks } from '../ci-checks.mjs';

// Runs the fast checks when Claude Code considers a task complete.
// Exit code 2 tells Claude Code the result is blocking; the stderr text is fed
// back to the agent so it can self-correct in a new iteration.
const result = runChecks({ capture: true });

if (result.status === 'error') {
  process.stderr.write(result.message);
  process.exit(2);
}

process.exit(0);
