# tapout-ai

A reference setup for a **Spring Boot + Angular monorepo**, built to demonstrate how to wire up
tooling, conventions, and AI-agent guidance so that both halves of a full-stack project stay
consistent, verified, and maintainable — from the first commit on.

The application itself is intentionally minimal (a single demo route); the value of this repository
is the setup around it.

## Contents

- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [What this setup demonstrates](#what-this-setup-demonstrates)
- [Verification](#verification)
- [Roadmap / open points](#roadmap--open-points)

## Repository layout

| Path                                         | Contents                                                                                  |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`frontend/`](frontend/README.md)            | Angular 22 single-page app — pnpm, PrimeNG, Transloco, NgRx Signals, Tailwind             |
| [`backend/`](backend/AGENTS.md)              | Spring Boot 4.1 service — Gradle (Kotlin DSL), Java 25, JPA, Flyway                       |
| [`style-guide/`](style-guide/style-guide.md) | Per-file-type style guides (TypeScript, templates, SCSS, a11y, tests, npm, git, markdown) |
| [`.claude/skills/`](SKILLS.md)               | Task-specific agent skills, indexed in [`SKILLS.md`](SKILLS.md)                           |
| [`scripts/`](scripts/)                       | Repo verification — shared check runner, full-suite verify, Claude Code Stop hook         |

Guidance is layered: the root [`AGENTS.md`](AGENTS.md) holds monorepo-wide rules, each package has
its own `AGENTS.md` with stack, commands, and conventions, and the `CLAUDE.md` files simply include
them.

## Prerequisites

- **Node.js 26+** with **Corepack enabled** (`corepack enable`) — pnpm is pinned via the
  `packageManager` field in [`frontend/package.json`](frontend/package.json); never use npm or yarn
- **Java 25** (the Gradle wrapper handles Gradle itself)
- **Docker** — provides PostgreSQL for the backend via
  [`backend/compose.yaml`](backend/compose.yaml)

## Quick start

Frontend:

```bash
cd frontend
pnpm install
pnpm start        # dev server on http://localhost:4200/
```

Backend:

```bash
cd backend
./gradlew bootRun # starts PostgreSQL via Docker Compose automatically
```

Full verification (lint, format, unit tests, builds, backend):

```bash
node scripts/verify.mjs
```

## What this setup demonstrates

### Conventions as configuration, not prose

- **Formatting**: Prettier ([`frontend/.prettierrc`](frontend/.prettierrc)) plus a repo-root
  [`.editorconfig`](.editorconfig) and [`.gitattributes`](.gitattributes) that enforce LF line
  endings and indentation everywhere — including on Windows.
- **Linting**: ESLint flat config with rules derived from the
  [style guides](style-guide/style-guide.md); each rule carries a comment naming the guide line it
  enforces.
- **Module boundaries**: [Sheriff](https://sheriff.softarc.io)
  ([`frontend/sheriff.config.ts`](frontend/sheriff.config.ts)) enforces a DDD structure —
  `src/app/<scope>/<type>` with `feature`/`ui`/`data-access`/`domain`/`util`/`shell` categories and
  strict dependency arrows — on every lint run.

### Testing on both levels

- **Unit**: Vitest through Angular's `unit-test` builder (`pnpm test`), zoneless, jsdom.
- **E2E**: Playwright (`pnpm e2e`) with a `webServer` block that starts or reuses the dev server;
  specs follow a role/label/text selector ladder with web-first assertions.

### Automated verification loops

- A **Claude Code Stop hook** ([`scripts/hooks/claude-stop-hook.mjs`](scripts/hooks/claude-stop-hook.mjs))
  runs lint + format checks whenever an agent finishes, skips when nothing changed, and guards
  against blocking loops.
- [`scripts/verify.mjs`](scripts/verify.mjs) runs the full suite; both share one step runner
  ([`scripts/ci-checks.mjs`](scripts/ci-checks.mjs)).

### AI-agent guidance that scales

- Layered `AGENTS.md` files keep always-in-context guidance lean; deep knowledge lives in
  **skills** loaded just in time (see [`SKILLS.md`](SKILLS.md) for the index and the reasoning).
- Coding rules live in exactly one place — the [style guides](style-guide/style-guide.md) — and are
  referenced, never restated.
- The Angular CLI **MCP server** is preconfigured in [`.mcp.json`](.mcp.json) for version-aware
  docs and schematics.

### Secret hygiene

Real keys (e.g. the PrimeNG license) live only in the git-ignored
`frontend/src/environments/environment.local.ts` (copy from
[`environment.local.example.ts`](frontend/src/environments/environment.local.example.ts)); nothing
secret is ever committed.

## Verification

| Command                                | Scope                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `node scripts/verify.mjs`              | Everything: frontend lint/format/test/build + backend build               |
| `pnpm lint` / `pnpm test` / `pnpm e2e` | Frontend, run inside `frontend/`                                          |
| `./gradlew build`                      | Backend, run inside `backend/` (currently needs PostgreSQL — see roadmap) |

## Roadmap / open points

Known gaps this reference setup still wants to close, roughly in order:

1. **Backend green on a fresh clone** — `./gradlew build` currently fails without a running
   PostgreSQL (`contextLoads` finds no datasource). Planned: **Testcontainers** with
   `@ServiceConnection` so tests provision their own database.
2. **CI pipeline** — no `.github/workflows/` yet. Planned: a workflow mirroring
   `scripts/verify.mjs` with pnpm and Gradle caching, plus Playwright against a production build.
3. **Frontend ↔ backend integration slice** — no touchpoint exists yet. Planned: one vertical
   slice (Flyway migration → JPA entity → validated REST endpoint → `httpResource()` in the
   frontend via a dev-server proxy) to demonstrate the monorepo interplay and give the Sheriff
   categories real code.
4. **Pin the toolchain machine-readably** — add `engines`/`.nvmrc` for Node; the style guides name
   Node 26 only in prose.
5. **Harden `backend/compose.yaml`** — still stock Spring Initializr output: pin the PostgreSQL
   major version and name the database/user after the project.
6. **License** — add a `LICENSE` file once the repo is published as a public template.
7. **Dependency automation** — Renovate (or Dependabot) configuration.
8. **Architecture docs placeholders** — `CONTEXT.md` (domain glossary) and `docs/adr/`, which the
   architecture-review skill already expects.
