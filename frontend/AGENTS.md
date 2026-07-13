You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular v22+ and TypeScript v6+ best practices.

## Agent Behavior & Workflow

- **Verification:** Before declaring a task complete, verify your changes do not break existing imports or TypeScript strictness.
- **Context:** Do not guess dependencies. If you need to know an installed library version, read `package.json`.
- **Comments:** Don't remove existing comments in the code.
- **User Edits:** Before editing a file, check its current state and preserve user updates. Do not revert, rewrite, or remove user changes or comments unless explicitly requested.
- **Diffs:** Prefer minimal diffs.
- **Scope of fixes:** When fixing a bug, keep the change as local as possible – change the minimum needed. Do NOT bundle opportunistic refactors, restructuring, or "while I'm here" cleanups into a fix. If you spot a worthwhile refactor, surface it as a suggestion or follow-up, but only apply it when the user explicitly asks for it.
- **ESLint:** Run lint and relevant tests before finishing.
- **Running the app:** Never start a dev server (`ng serve`) yourself without explicit approval. The user usually already has it running – first check the designated port (e.g. `http://localhost:4200`) and use the running server if present. Only if nothing is running there may you ask for approval to start it. Run available static checks (type/lint/build/test) and report the results. (See the Testing section for the exact check.)
- **Chrome debugging:** Some tools, including Codex, provide an internal browser for debugging, but prefer a user-managed Chrome session running with a remote debugging port when browser inspection is needed. Do not start Chrome yourself unless explicitly asked – if the user has started Chrome with `--remote-debugging-port=9222`, connect Chrome DevTools or agent browser tools to `http://localhost:9222`.
- **Angular MCP server:** This workspace ships the Angular CLI MCP server, configured as `angular-cli` in the repo-root `.mcp.json` (runs `pnpm -C <repo>/frontend exec ng mcp`, so it always resolves this `frontend/` workspace). Prefer its tools for Angular-specific work – version-aware docs search, `ng generate` schematics, and workspace/project inspection – over answering from memory. Clients load it on startup and prompt for approval on first use; see https://angular.dev/ai/mcp.
- **Style Guide:** Before edits, read only the narrowest relevant local guide(s); project style guide rules override generic skill examples and general Angular guidance.
  - [Angular baseline](style-guide/style-guide.md) – component and Angular coding conventions.
  - [TypeScript](style-guide/style-guide.ts.md) – `.ts` files and TypeScript patterns.
  - [HTML templates](style-guide/style-guide.html.md) – Angular templates and template accessibility.
  - [SCSS](style-guide/style-guide.scss.md) – component styles, selectors, tokens, and layout.
  - [Accessibility](style-guide/style-guide.a11y.md) – semantic HTML, keyboard behavior, ARIA, and WCAG checks.
  - [Testing](style-guide/style-guide.spec.md) – unit and e2e test conventions.
  - [NPM packages](style-guide/style-guide.npm.md) – dependency and package changes.
  - [Git](style-guide/style-guide.git.md) – branch, commit, and review workflow.
  - [Markdown](style-guide/style-guide.md.md) – documentation and Markdown edits.
- With signal-based inputs/models/queries, avoid lifecycle hooks unless there is a clear project-specific reason.
- Do not modify unrelated files.

## TypeScript Best Practices

- Use strict type checking (`strict: true`).
- Prefer type inference when the type is obvious.
- NEVER use the `any` type. Use `unknown` when a type is strictly uncertain and narrow it via type guards.
- Do not use the `_` prefix for private or protected members.
- Make sure to not create any new lint errors or warnings.
- **DOM collections:** `NodeListOf` and `HTMLCollectionOf` do NOT have `[Symbol.iterator]()` in this project's strict TypeScript config. Always wrap them with `Array.from()` before using `for...of`, spread, or array methods (e.g., `Array.from(el.querySelectorAll('.foo'))`).
- **No hardcoded layout values:** Never assume fixed pixel sizes for dynamically sized elements (chips, tags, badges, etc.). Always measure actual rendered dimensions via `offsetWidth`/`offsetHeight`/`getBoundingClientRect()` and account for CSS `gap`, `padding`, and `flex-shrink` behavior.
- **Build verification:** After every code change, run the TypeScript compiler / eslint (`npx nx lint <project>`) and confirm zero errors before declaring the task done. Do not rely on IDE hints alone.

## Modern Angular (v22+) Standards

- **Standalone:** Always use standalone components. Do NOT set `standalone: true` inside the decorator, as it is the default in v20+.
- **Zoneless:** Assume the application is Zoneless. Never import `zone.js`. Rely on Signals for reactivity.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use NgRx signal store for state management
- **Data Fetching:** Use the new `resource()`, `rxResource()` or `httpResource()` APIs for asynchronous data fetching instead of traditional RxJS + async pipe patterns.
- **Routing:** Implement lazy loading for feature routes using `loadComponent`.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
