# OpenAPI TypeScript Server

OpenAPI TypeScript Server is a CLI and minimal runtime library that helps you implement type-safe APIs documented by OpenAPI. This is a monorepo with framework-agnostic core functionality and Express adapter.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Node.js Version Requirement - CRITICAL

- **REQUIRED**: Node.js >= 23.6.0 (specified in .nvmrc and package.json)
- Current examples and tests use TypeScript files directly which requires Node.js 23+ experimental TypeScript support
- If you have an older Node.js version, you MUST upgrade first or many commands will fail

### Bootstrap and Build Process

- Install dependencies: `npm ci` -- takes 30 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
- Check code formatting: `npm run format:check` -- takes 2 seconds
- Build all packages: `npm run build:packages` -- takes 5 seconds
- Generate examples: `npm run gen:examples` -- takes 5 seconds
- TypeScript type checking: `npm run typecheck` -- takes 3 seconds
- Run tests: `npm test` -- takes 1 second (requires Node.js 23+)

### Complete Development Setup Sequence

```bash
# 1. Ensure Node.js version (CRITICAL)
node --version  # Must be >= 23.6.0

# 2. Install dependencies
npm ci  # NEVER CANCEL: Takes 30 seconds

# 3. Build packages
npm run build:packages  # Takes 5 seconds

# 4. Generate examples (validates CLI tools work)
npm run gen:examples  # Takes 5 seconds

# 5. Validate everything
npm run format:check  # Takes 2 seconds
npm run typecheck     # Takes 3 seconds
npm test             # Takes 1 second (requires Node.js 23+)
```

## Repository Structure

### Core Packages

- `packages/openapi-typescript-server`: Core CLI and type generation
- `packages/openapi-typescript-server-express`: Express framework adapter
- `packages/openapi-typescript-server-runtime`: Shared runtime utilities

### Examples

- `examples/docs`: Basic petstore API example with full server setup
- `examples/kitchensink`: More complex API demonstrating various features
- `examples/petstore`: Standard petstore example

### Key Files

- `.nvmrc`: Specifies required Node.js version (v23.6.0)
- `package.json`: Workspace configuration and scripts
- `tsconfig.json`: TypeScript configuration for entire monorepo

## CLI Tools and Code Generation

### OpenAPI TypeScript Type Generation

```bash
# Generate TypeScript types from OpenAPI spec
npx openapi-typescript ./openapi.yaml --output ./gen/schema.d.ts
```

### Server Interface Generation

```bash
# Generate server interface from OpenAPI spec
npx openapi-typescript-server ./openapi.yaml --types ./schema.d.ts --output ./gen/server.ts
```

### Complete Workflow Example

```bash
# In any example directory (e.g., examples/docs):
openapi-typescript ./openapi.yaml --output ./gen/schema.d.ts
openapi-typescript-server ./openapi.yaml --types ./schema.d.ts --output ./gen/server.ts
```

## Running and Testing

### Run Example Applications

**IMPORTANT**: Requires Node.js >= 23.6.0

```bash
# Navigate to an example
cd examples/docs

# Start the server (with hot reload)
npm run start  # Runs: node --watch cmd/index.ts

# Server will be available at http://localhost:8080
```

### Test API Endpoints

```bash
# Test the petstore API
curl -X POST http://localhost:8080/api/v3/speak/123 \
  -H "Content-Type: application/json" \
  -d '{"sound":"grrrr"}'

# Expected response:
# {"greeting":"Pet 123 says \"grrrr\""}
```

### Run Tests

**NOTE**: Tests require Node.js >= 23.6.0 to run TypeScript files directly

```bash
# Run all tests across workspace
npm test

# Run tests for specific package
cd packages/openapi-typescript-server-express
npm test
```

## Validation Scenarios

### CRITICAL: Always Run These After Changes

1. **Build Validation**: `npm run build:packages` - Must complete successfully
2. **Format Check**: `npm run format:check` - Must pass for CI
3. **Type Checking**: `npm run typecheck` - Must pass with no errors
4. **Code Generation**: `npm run gen:examples` - Must regenerate without errors
5. **Test Suite**: `npm test` - Must pass (requires Node.js 23+)

### Manual Validation After Server Changes

1. Start an example server: `cd examples/docs && npm run start`
2. Test API endpoint: `curl -X POST http://localhost:8080/api/v3/speak/123 -H "Content-Type: application/json" -d '{"sound":"test"}'`
3. Verify JSON response: `{"greeting":"Pet 123 says \"test\""}`
4. Test error endpoint: `curl http://localhost:8080/api/v3/uhoh`
5. Verify error response with status 418

### Before Committing

- ALWAYS run `npm run format` to auto-fix formatting issues
- ALWAYS run the complete validation sequence above
- The CI pipeline (.github/workflows/test.yaml) will fail if formatting or builds fail

## Common Issues and Solutions

### Node.js Version Mismatch

**Problem**: `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"`
**Solution**: Upgrade to Node.js >= 23.6.0. The project uses experimental TypeScript support.

### Build Failures

**Problem**: `npm run build:packages` fails
**Solution**:

1. Run `npm ci` to ensure dependencies are properly installed
2. Check TypeScript compilation with `npm run typecheck`
3. Verify all workspace packages have built correctly

### Test Failures

**Problem**: Tests not running or failing unexpectedly
**Solution**:

1. Ensure Node.js >= 23.6.0
2. Run `npm run build:packages` first
3. Check individual test files in packages/_/src/_.test.ts

## Development Tips

### Working with OpenAPI Specs

- Always validate your OpenAPI spec before generation
- Use `--types ./schema.d.ts` path relative to output directory
- Re-run generation after any spec changes: `npm run gen:examples`

### Monorepo Navigation

- Use `npm run <script> --workspaces` to run scripts across all packages
- Build packages before working on examples: `npm run build:packages`
- Each package has its own package.json with specific scripts

### Code Quality

- Format code: `npm run format`
- Check formatting: `npm run format:check`
- Type check: `npm run typecheck`
- All of these must pass for CI to succeed

## Time Expectations - NEVER CANCEL Commands

- `npm ci`: 30 seconds - NEVER CANCEL, set timeout to 60+ minutes
- `npm run build:packages`: 5 seconds
- `npm run gen:examples`: 5 seconds
- `npm run typecheck`: 3 seconds
- `npm run format:check`: 2 seconds
- `npm test`: 1 second (when Node.js version is correct)

## Files You'll Frequently Need

### Package Manifests

```
ls -la [repo-root]
.github/
.nvmrc
package.json              # Root workspace config
packages/                 # Core packages
├── openapi-typescript-server/
├── openapi-typescript-server-express/
└── openapi-typescript-server-runtime/
examples/                 # Example applications
├── docs/
├── kitchensink/
└── petstore/
```

### Key Package Files

- `packages/openapi-typescript-server/src/cli/index.ts`: Main CLI entry point
- `packages/openapi-typescript-server-express/src/index.ts`: Express adapter
- `examples/docs/app.ts`: Complete Express server setup example
- `examples/docs/api.ts`: API handler implementation example
