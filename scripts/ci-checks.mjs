import { execSync } from 'node:child_process';
import process from 'node:process';

const isWindows = process.platform === 'win32';

// The Gradle wrapper differs by platform; the shell resolves `pnpm` on both.
const gradlew = isWindows ? 'gradlew.bat build' : './gradlew build';

// Fast checks run on every agent Stop hook — keep them cheap so completing a
// task stays snappy. Steps run in order and stop at the first failure.
const fastSteps = [
  { cmd: 'pnpm lint', cwd: 'frontend' },
  { cmd: 'pnpm format:check', cwd: 'frontend' },
];

// Full checks add the slow stuff (unit tests, builds, backend). Not wired into
// the Stop hook — run them manually via `node scripts/verify.mjs` or in CI.
const fullOnlySteps = [
  { cmd: 'pnpm test --watch=false', cwd: 'frontend' },
  { cmd: 'pnpm build', cwd: 'frontend' },
  { cmd: gradlew, cwd: 'backend' },
];

// Runs the CI steps in order and stops at the first failing one.
// Returns a discriminated result instead of throwing so callers can map it
// to whatever their environment expects (exit code, JSON payload, ...).
export function runChecks({ full = false, capture = false } = {}) {
  const steps = full ? [...fastSteps, ...fullOnlySteps] : fastSteps;
  for (const step of steps) {
    const options = {
      cwd: step.cwd,
      ...(capture ? { encoding: 'utf8' } : { stdio: 'inherit' }),
    };
    try {
      execSync(step.cmd, options);
    } catch (error) {
      const out = capture
        ? [error.stdout, error.stderr].filter(Boolean).join('\n').trim()
        : '';
      return {
        status: 'error',
        message: `Check failed: ${step.cmd} (in ${step.cwd}/)\n\n${out || error.message}`,
      };
    }
  }
  return { status: 'success' };
}
