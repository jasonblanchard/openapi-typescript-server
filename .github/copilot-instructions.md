# OpenAPI TypeScript Server

OpenAPI TypeScript Server is a CLI and runtime library for building type-safe APIs from OpenAPI specs. This monorepo contains framework-agnostic core functionality, an Express adapter, and runtime utilities.

## Core Architecture

### Three-Layer System

1. **Code Generation Layer** (`packages/openapi-typescript-server`): CLI using `ts-morph` to generate TypeScript interfaces from OpenAPI specs
2. **Runtime Layer** (`packages/openapi-typescript-server-runtime`): Minimal shared types (`Route`, `HandlerInput`, `HandlerResponse`) and errors
3. **Adapter Layer** (`packages/openapi-typescript-server-express`): Framework bindings that convert typed handlers to HTTP routes

### Data Flow Pattern

```
OpenAPI Spec → [CLI] → Generated Server Interface → [Your API Implementation] → [registerRouteHandlers] → Route[] → [Adapter] → Express Routes
```

Key insight: Your handler return values mirror OpenAPI response structure:

```typescript
return {
  content: {
    [statusCode]: {  // e.g., 200, "default", "5XX"
      [contentType]: responseData  // e.g., "application/json"
    }
  },
  headers?: {},
  status?: number  // Required for "default" and wildcard responses
}
```

### Generated Code Pattern

CLI generates per-operation:

- `<OperationId>Args<Req, Res>` interface with typed parameters, requestBody, and framework objects
- `<OperationId>Result` type union of all response variants
- `<OperationId>Unimplemented()` stub throwing `NotImplementedError`
- `Server<Req, Res>` interface requiring all operations
- `registerRouteHandlers()` function converting implementations to `Route[]`

**Critical**: `operationId` determines handler names. Without it, name is `${method}${PathParts}` (e.g., `postSpeakPetId`).

## Node.js Version Requirement - CRITICAL

- **REQUIRED**: Node.js >= 23.6.0 (`.nvmrc`, `package.json` engines)
- Uses experimental TypeScript support via `node --watch` and direct `.ts` execution
- Error `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"` means wrong Node version

## Development Workflow

### Initial Setup (Required Order)

```bash
node --version              # Must be >= 23.6.0
pnpm install                # 30 seconds - NEVER CANCEL
pnpm run build:packages     # 5 seconds - builds .cjs files
pnpm run gen:examples       # 5 seconds - validates CLI works
pnpm run format:check       # 2 seconds
pnpm run typecheck          # 3 seconds
pnpm test                   # 1 second
```

**NEVER** run `pnpm install` with short timeout. Set to 60+ minutes or it will fail.

### After Code Changes (Validation Sequence)

```bash
pnpm run format             # Auto-fix formatting (required before commit)
pnpm run build:packages     # Re-build if CLI or adapters changed
pnpm run gen:examples       # Re-generate if CLI changed (checks for uncommitted diffs in CI)
pnpm run typecheck          # Must pass (no errors)
pnpm test                   # All tests must pass
```

### Testing Generated Code Locally

```bash
cd examples/docs
pnpm run start              # Runs: node --watch cmd/index.ts (port 8080)

# In another terminal:
curl -X POST http://localhost:8080/api/v3/speak/123 \
  -H "Content-Type: application/json" \
  -d '{"sound":"test"}'
# Expected: {"greeting":"Pet 123 says \"test\""}
```

### Regenerating After OpenAPI Changes

```bash
# In example directory or your project:
openapi-typescript ./openapi.yaml --output ./gen/schema.d.ts
openapi-typescript-server ./openapi.yaml --types ./schema.d.ts --output ./gen/server.ts

# TypeScript will immediately show errors for missing/changed properties
# Restart TS Server in VS Code if errors don't appear
```

## Express Adapter Patterns

### Request Processing (`packages/openapi-typescript-server-express/src/index.ts`)

1. **Path conversion**: `{petId}` → `:petId` via `openAPIPathToExpress()`
2. **Parameter extraction**: Assumes Express middleware already parsed/validated body
   ```typescript
   parameters: {
     query: req.query,
     header: req.headers,
     path: req.params,
     cookie: req.cookies
   }
   ```
3. **Content negotiation**: Uses `req.accepts()` to match against response content types
4. **Serialization**:
   - `application/json`: Built-in via `res.json()`
   - Other types: Supply `serializers` option to `registerRoutes()`
   ```typescript
   registerRoutes(routes, app, {
     serializers: {
       "application/xml": (content) => json2xml(JSON.stringify(content)),
     },
   });
   ```

### Error Handling Patterns

1. **Inline errors**: Return `{ status: 418, content: { default: {...} } }` from handler
2. **Thrown errors**: Propagate to Express global error handler
3. **NoAcceptableContentType**: Thrown when client Accept header doesn't match response content types
4. **NotImplementedError**: Check `err instanceof NotImplementedError` for 501 responses

See `examples/docs/api.ts` for error pattern with `"default"` response variant.

## Testing Conventions

- Framework: Node.js native `node:test` and `node:assert`
- Pattern: `describe()` + `it()` with `beforeEach()` for setup
- HTTP testing: `supertest` library for request/response assertions
- Location: Co-located `.test.ts` files (e.g., `index.ts` → `index.test.ts`)
- Run: `pnpm test` at root (runs across all workspaces) or per-package

Example pattern (`examples/docs/app.test.ts`):

```typescript
import { describe, it } from "node:test";
import assert from "node:assert";
import request from "supertest";

const app = makeApp();

describe("operation", async () => {
  it("returns expected status", async () => {
    const response = await request(app)
      .post("/api/v3/path")
      .send({ data: "value" });
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { expected: "value" });
  });
});
```

## Repository Structure

```
packages/
  openapi-typescript-server/          # CLI (commander, ts-morph, yaml)
    src/cli/
      index.ts                         # Entry point, arg parsing
      generate.ts                      # Core codegen logic (creates Server interface)
    bin/cli/index.cjs                  # Built binary (created by build:packages)

  openapi-typescript-server-runtime/  # Shared types (Route, errors)
    src/
      route.ts                         # Route, HandlerInput, HandlerResponse types
      errors.ts                        # NotImplementedError

  openapi-typescript-server-express/  # Express adapter
    src/
      index.ts                         # registerRoutes() function
      errors.ts                        # NoAcceptableContentType
      index.test.ts                    # Adapter integration tests

examples/
  docs/                                # Reference implementation
    openapi.yaml                       # Source of truth
    gen/
      schema.d.ts                      # From openapi-typescript
      server.ts                        # Generated by this CLI
    api.ts                             # Handler implementations (Server interface)
    app.ts                             # Express setup (middleware + registerRoutes)
    cmd/index.ts                       # Server entry point (starts listening)
```

## Key Workflows for Common Tasks

### Adding Support for New Response Pattern

1. Update `packages/openapi-typescript-server/src/cli/generate.ts` response variant logic
2. Update `packages/openapi-typescript-server-express/src/index.ts` to handle new variant
3. Add test case to `packages/openapi-typescript-server-express/src/index.test.ts`
4. Run `pnpm run build:packages && pnpm run gen:examples && pnpm test`

### Adding New Framework Adapter

1. Create `packages/openapi-typescript-server-<framework>/`
2. Implement `registerRoutes(routes: Route[], app: FrameworkApp)`
3. Handle parameter extraction, content negotiation, serialization per framework conventions
4. Reference `openapi-typescript-server-express` as template
5. Add integration tests using framework's test utilities

### Debugging Type Errors After Regeneration

1. Check OpenAPI spec changed: Compare old/new `openapi.yaml`
2. Check generated types: `git diff gen/schema.d.ts gen/server.ts`
3. Restart TS Server: VS Code may cache old types
4. Read error location: Generated interfaces have JSDoc with descriptions
5. Fix implementation to match new types (TypeScript guides you)

## CI/CD Pipeline (`.github/workflows/test.yaml`)

Runs on every commit:

```yaml
pnpm install --frozen-lockfile
pnpm run format:check      # Fails if code not formatted
pnpm run build:packages
pnpm run gen:examples
git diff --exit-code        # Fails if generated code differs (means you didn't commit regenerated examples)
pnpm run typecheck
pnpm test
```

**Before pushing**: Always run `pnpm run format` + validation sequence or CI fails.

## Design Decisions to Remember

1. **Schema-first**: OpenAPI spec is single source of truth (not code annotations)
2. **Build-time codegen over runtime reflection**: Minimal runtime footprint, static typing
3. **Validation delegated to middleware**: Use `express-openapi-validator`, not built-in
4. **Framework-agnostic core**: Runtime types have no framework dependencies
5. **Generic request/response access**: `Server<Req, Res>` lets you access underlying framework objects
6. **Verbose return structure**: Mirrors OpenAPI structure exactly, making handlers pure functions (easy to test)

## Common Mistakes

- ❌ Forgetting to run `pnpm run build:packages` after CLI changes (tests import stale code)
- ❌ Not regenerating examples after CLI changes (CI will fail on diff check)
- ❌ Using structural typing instead of explicit `Server<Req, Res>` type (loses inference)
- ❌ Mounting routes without base path (OpenAPI `servers.url` ignored by adapter)
- ❌ Returning `"default"` response without `status` field (throws error at runtime)
- ❌ Expecting validation/coercion (must use middleware like `express-openapi-validator`)
