# Enhance — Build TODO

Step-by-step checklist. Check off as you implement.

---

## Phase 0: Project Setup
- [x] Initialize npm (`npm init -y`)
- [x] Install deps: `commander chalk ora cosmiconfig @anthropic-ai/sdk fast-glob`
- [x] Install dev deps: `typescript tsx tsup @types/node`
- [x] Create `tsconfig.json` (NodeNext module, strict mode)
- [x] Create `tsup.config.ts` (ESM, node20 target, shebang banner)
- [x] Update `package.json`: name, version, bin, scripts, type=module
- [x] Create `.gitignore`

## Phase 1: Shared Types
- [x] Create `src/types.ts`
  - `ProjectStack` — language, frameworks[], runtime, orm, testing, packageManager, nextRouterType, uiLibrary
  - `FolderStructure` — root, dirs[], srcDirs[], hasAppDir, hasPagesDir, hasSrcDir
  - `Intent` — action, entity, feature, target, rawPrompt
  - `ScanResult` — stack, structure, projectRoot, scannedAt
  - `EnhanceConfig` — provider, model, maxContextTokens, customInstructions, apiKey
  - `EnhancedPrompt` — original, enhanced, intent, stack
  - `AIProvider` — name, send()

## Phase 2: CLI
- [x] Create `src/cli/logger.ts` — chalk-colored log/info/warn/error/success helpers
- [x] Create `src/cli/errors.ts` — `EnhanceError` class with `code` + `message`
- [x] Create `src/cli/index.ts`
  - Commander.js setup, `enhance <prompt>` command
  - Options: `--provider`, `--dry-run`, `--print-prompt`, `--verbose`
  - Full pipeline wired: config → scan → intent → context → enhance → AI

## Phase 3: Project Scanner
- [x] `src/scanner/package.ts` — reads/parses package.json
- [x] `src/scanner/frameworks.ts` — detects stack from deps + lockfiles + config files
- [x] `src/scanner/structure.ts` — maps folder tree, detects app/pages/src dirs
- [x] `src/scanner/tsconfig.ts` — reads tsconfig paths/baseUrl
- [x] `src/scanner/index.ts` — orchestrates all scanners → `ScanResult`

## Phase 4: Intent Analyzer
- [x] `src/analyzer/intent.ts`
  - Keyword maps for action (create/fix/refactor/explain/add/delete)
  - Keyword maps for entity (page/component/api/hook/util/config/style)
  - Keyword maps for feature (auth/dashboard/payment/user/upload/notification/etc)

## Phase 5: Prompt Enhancement Engine
- [x] `src/enhancer/injectors.ts` — framework + intent-aware best-practice rules
- [x] `src/enhancer/template.ts` — assembles final prompt from stack + injections + context
- [x] `src/enhancer/index.ts` — orchestrates: intent → injections → template → EnhancedPrompt

## Phase 6: Context Optimizer
- [x] `src/analyzer/context.ts`
  - Always-include: layout files, entry points
  - Feature-driven file search via fast-glob (auth → `*login*`, `*auth*`, etc.)
  - Pattern sampling: 1-2 existing components
  - Token budget enforcement (12,000 char max)
  - File truncation at 250 lines

## Phase 7: Caching
- [x] `src/cache/index.ts`
  - `getCached(root)` — reads `.enhance-cache.json`, invalidates if package.json newer
  - `setCached(root, result)` — writes cache

## Phase 8: Config
- [x] `src/config/index.ts`
  - cosmiconfig search for `.enhancerc`, `.enhancerc.json`, `enhance.config.js`, `package.json#enhance`
  - Defaults: provider=claude, model=claude-sonnet-4-6, maxContextTokens=3000
  - API key resolution: config → env var (lazy — validated at provider instantiation)

## Phase 9: AI Providers
- [x] `src/providers/claude.ts` — Anthropic SDK, streaming, validates API key
- [x] `src/providers/codex.ts` — spawns `codex` + `opencode` subprocess (stdio: inherit)
- [x] `src/providers/index.ts` — factory: `getProvider(config) → AIProvider`

## Phase 10: Polish
- [x] Build verified: `npm run build` succeeds
- [x] Dry-run verified: `node dist/index.js "build login page" --dry-run` prints enhanced prompt
- [ ] Install vitest + write unit tests
  - `src/scanner/frameworks.test.ts`
  - `src/analyzer/intent.test.ts`
  - `src/enhancer/injectors.test.ts`
- [ ] Global install smoke test: `npm run build && npm install -g . && enhance "build login page" --dry-run`
- [ ] Write README.md

---

## Configuration Reference

Create `.enhancerc.json` in your project root:

```json
{
  "provider": "claude",
  "model": "claude-sonnet-4-6",
  "maxContextTokens": 3000,
  "customInstructions": "Always use React Query for data fetching. Prefer named exports."
}
```

Set API key: `export ANTHROPIC_API_KEY=sk-ant-...`

---

## Usage Examples

```bash
# Basic usage
enhance "build a login page with email and password"

# Dry-run (print enhanced prompt without calling AI)
enhance "fix the auth bug" --dry-run

# See what was detected + sent
enhance "create dashboard component" --print-prompt --verbose

# Use a different AI provider
enhance "refactor the user service" --provider codex
```

---

## Project Structure

```
src/
├── cli/
│   ├── index.ts        # Entry, Commander.js
│   ├── logger.ts       # Chalk output helpers
│   └── errors.ts       # EnhanceError class
├── scanner/
│   ├── index.ts        # Orchestrator → ScanResult
│   ├── package.ts      # Reads package.json
│   ├── frameworks.ts   # Detects stack from deps
│   ├── structure.ts    # Maps folder tree
│   └── tsconfig.ts     # Reads path aliases
├── analyzer/
│   ├── intent.ts       # Parses prompt → Intent
│   └── context.ts      # Finds relevant files
├── enhancer/
│   ├── index.ts        # Main enhance() fn
│   ├── injectors.ts    # Best-practice rules
│   └── template.ts     # Prompt assembler
├── providers/
│   ├── index.ts        # Factory: getProvider()
│   ├── claude.ts       # Anthropic SDK + streaming
│   └── codex.ts        # Subprocess providers
├── cache/
│   └── index.ts        # JSON cache, mtime invalidation
├── config/
│   └── index.ts        # cosmiconfig loader
└── types.ts            # All shared interfaces
```
