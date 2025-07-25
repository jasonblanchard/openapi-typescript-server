# openapi-typescript-server

`openapi-typescript-server` is a CLI and minimal runtime library that helps you implement type-safe APIs documented by OpenAPI.

It works by generating a TypeScript server interface based on the operations defined in your OpenAPI spec using types from the [openapi-typescript](https://github.com/openapi-ts/openapi-typescript) package.

You provide a concrete implementation that satisfies the interface.

At runtime, your implementation is handed off to adapters that convert it into HTTP handlers for various frameworks like [Express](https://expressjs.com/).

## Stability

⚠️ This package is in very early development. Breaking changes may be introduced as the design and implementation takes shape towards a stable release.

For now, proceed with caution!

## Usage

### Installation

First, install the build time packages as dev dependencies:

```bash
npm install -D openapi-typescript openapi-typescript-server
```

Then, install the adapter you need (the rest of this example will use Express):

```bash
npm install openapi-typescript-server-express
```

Not required but highly recommended, install middleware for runtime type validation and coercion:

```bash
npm install express-openapi-validator
```

### Project setup

Given an OpenAPI spec like this:

TODO: Example spec

First, follow [recommended setup from openapi-typescript](https://openapi-ts.dev/introduction).

Generate types from your OpenAPI spec:

```bash
openapi-typescript ./spec.yaml --output ./gen/schema.d.ts
```

Generate the server interface from your OpenAPI spec and type definition:

```bash
openapi-typescript-server ./spec.yaml --types ./schema.d.ts --output ./gen/server.ts
```

> Note: the `--types` flag is relative to where the output is saved so that it knows where to import it from. In this case, `schema.d.ts` is in the same directory as `./gen/server.ts`

Write route handlers by implementing the interface:

TODO: Example implementation

- Explicitly specifying the type rather than relying on structural typing, gives you type inference for handler arguments and faster feedback in the definition vs at the call site.

Register your route handlers:

TODO: express app setup

- Optional validator middleware
- Optional error handling

You can now make a request to your service:

TODO: Example

### How does this work?

#### Route handling

The return value of your route handlers roughly matches the structure of the OpenAPI V3 spec path response content:

```
- content:
  - response variant (status code int or "default"):
    - content type (usually "application/json"):
      - <your schema starts here>
```

The route handler name uses the `operationId` if present. Otherwise it's generated based on path and method.

The return value is enveloped in `content` so that you can provide `headers` and `status` at the same level. `status` is required when the response variant is "default".

> NOTE: These return values are a bit verbose, but, since the HTTP handling is delegated to the adapters, they have the added benefit of being easily testable functions with data in and out.

Your route handlers are packaged up into the generated `registerRouteHandlers` function. This returns a list of objects containing the route method, path, and handler function.

Adapters supply a `registerRoutes` function which iterates through this data structure and uses the underlying framework (i.e. Express) to add each route, set headers, serialize response bodies, and terminate the response.

#### Content type serialization

Content type serialization and deserialization happens in the adapter layer.

For Express, request bodies can be deserialized to JavaScript objects by middleware. The Express adapter assumes this has already happened and passes the deserialized (and presumably validated and coerced) JavaScript objects to your route handlers.

For response body serialization, `application/json` is built in and happens automatically. Other content types can be handled by supplying a `serializers` option to the `registerRoutes` function with custom serialization functions keyed by content type.

TODO: Example

### Accessing the underlying request and response objects

In some cases, you may need to access the `request` or `response` objects from the underlying HTTP framework.

These are generic arguments you can access in your handler implementation:

TODO: Example

#### Error handling

Errors can be handled directly in your route handlers by defining a "default" schema for all errors. In the route handler, return the "default" response variant and include a `status` code.

TODO: Example

Otherwise, thrown errors will propagate up the call stack to your global error handler. You can check for `err instanceof NotImplementedError` if you want to handle those with a `501 Not Implemented` status code.

## Design goals

The main goal of this package is to ensure that the server implementation stays in sync with the API documentation by generating a typed inferface _from_ the OpenAPI spec.

This schema-first approach documents your system for humans or LLM coding agents, and helps you achieve type safety across the system.

### In scope/goals

- **Trade off build time complexity for runtime simplicity**. By using codegen as a build step, the surface area of what's executed on the server is reduced.
- **Keep package footprint small**. Keep the solution space narrow by integrating with existing solutions.

### Out of scope/non-goals

- **Schema validation & type coercion**. This package assumes that all data inputs have been validated and coerced to the expected types by the time they get to your route handlers. Use other middleware like [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator) to handle validation and coercion.
- **Security & auth scopes**. This package does not handle any authentication nor authorization and ignores all security aspects of your OpenAPI schema.

### Inspiration & prior art

This package was heavily influenced by the [Go oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) package and gRPC ergonomics.

### Comparison to other solutions

- [openapi-typescript](https://github.com/openapi-ts/openapi-typescript). This library only generates types from an OpenAPI spec, not operation interfaces. This is foundational to this library, but only part of the solution.
- [openapi-ts-router](https://github.com/builder-group/community/tree/develop/packages/openapi-ts-router). This library works similarly, but requires that you bring your own path validators alongside the route handlers. It also doesn't ensure that you've implemented the entire spec.
- [tRPC](https://trpc.io/). This library tightly couples frontend and backend code and only works for systems that are TypeScript on the frontend and backend. It also requires a decent amount of runtime complexity to tie clients and servers together.
