# AGENTS.md

Central guidance for the **tapout-ai** monorepo. This file applies to the whole
repository; package-specific rules live in nested `AGENTS.md` files.

## Repository layout

- `frontend/` — Angular 22 single-page app (pnpm).
- `backend/` — Spring Boot 4.1 service (Gradle, Java 25).

## Frontend (`frontend/`)

Stack: Angular 22 (standalone components + signals), pnpm, PrimeNG, Transloco
(i18n), NgRx Signals, Tailwind CSS 4, ESLint + Prettier.

Commands — run inside `frontend/`:

| Command | Purpose |
| --- | --- |
| `pnpm start` | Dev server |
| `pnpm start:local` | Dev server with the local PrimeNG license (`environment.local.ts`) |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm lint` | ESLint |
| `pnpm format` / `pnpm format:check` | Prettier |

Angular/TypeScript coding conventions: see [`frontend/AGENTS.md`](frontend/AGENTS.md).

Project-specific conventions:

- **Package manager is pnpm** (provisioned via Corepack). Do not use npm or yarn.
- **Match dependency majors to Angular 22.** Where no v22 release exists yet
  (e.g. PrimeNG 22 RC, NgRx 21), that is intentional — expect and note peer warnings.
- **Static assets live in `public/`** (served at the app root), not `src/assets`.
  Transloco translations are in `public/i18n/<lang>.json`.
- **PrimeNG license** is read from Angular environments. Real keys go only in the
  git-ignored `src/environments/environment.local.ts` (copy from `.example`), never committed.
- **Line endings are LF**, enforced by `.gitattributes` and Prettier (`endOfLine: lf`).

## Backend (`backend/`)

Stack: Spring Boot 4.1, Java 25, Gradle (Kotlin DSL), Spring Data JPA, Flyway
(PostgreSQL), Bean Validation, Lombok.

Commands — run inside `backend/`:

| Command | Purpose |
| --- | --- |
| `./gradlew bootRun` | Run the app (needs PostgreSQL; see `compose.yaml`) |
| `./gradlew build` | Compile + test |
| `./gradlew test` | Tests |

Backend conventions (migrations, injection, Lombok): see [`backend/AGENTS.md`](backend/AGENTS.md).

## Git & PR workflow

- Implement changes on a feature branch first. Do **not** open a PR until asked.
- **Never merge** pull requests — the maintainer merges them by hand.
- Branch feature work off `main`; GitHub auto-deletes head branches on merge.
- Never commit secrets (e.g. the PrimeNG license key or any credentials).
