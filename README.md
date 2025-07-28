# openapi-typescript-server

`openapi-typescript-server` is a CLI and minimal runtime library that helps you implement type-safe APIs documented by OpenAPI.

It works by generating a TypeScript server interface based on your OpenAPI spec using types from [openapi-typescript](https://github.com/openapi-ts/openapi-typescript).

You provide a concrete implementation that satisfies the interface for each path operation.

At runtime, your implementation is converted into HTTP handlers for various frameworks like [Express](./packages/openapi-typescript-server-express/README.md).

## Stability

⚠️ This package is in very early development. Breaking changes may be introduced as the design and implementation takes shape towards a stable release. ⚠️

For now, proceed with caution!

## Usage

### Installation

Install build-time packages as dev dependencies:

```bash
npm install -D openapi-typescript openapi-typescript-server
```

Install runtime adapter (Express example):

```bash
npm install openapi-typescript-server-express
```

**Recommended**: Install middleware for runtime validation:

```bash
npm install express-openapi-validator
```

### Quickstart

Given an OpenAPI spec like this:

`spec.yaml`

```yaml
openapi: 3.0.2
info:
  title: Simple Petstore
  version: 0.0.1
servers:
  - url: /api/v3
paths:
  /speak/{petId}:
    post:
      operationId: makePetSpeak
      parameters:
        - name: petId
          in: path
          description: ID of pet that will speak
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                sound:
                  type: string
                  description: The sound the pet will make
              required:
                - sound
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                type: object
                properties:
                  greeting:
                    type: string
                    description: The greeting from the pet
                required:
                  - greeting
```

First, follow [recommended setup from openapi-typescript](https://openapi-ts.dev/introduction).

Generate types from your OpenAPI spec:

```bash
npx openapi-typescript ./spec.yaml --output ./gen/schema.d.ts
```

Generate the server interface:

```bash
npx openapi-typescript-server ./spec.yaml --types ./schema.d.ts --output ./gen/server.ts
```

> **Note**: The `--types` path is relative to the output directory so the generated code can import it correctly.

Implement your API handlers:

`api.ts`

```typescript
import type * as ServerTypes from "./gen/server.ts";
import type { Request, Response } from "express";

// Explicitly specifying the type (rather than relying on structural typing)
// gives you type inference for handler arguments and faster feedback in the
// definition vs at the call site.
const API: ServerTypes.Server<Request, Response> = {
  makePetSpeak: async ({ parameters, requestBody }) => {
    const petId = parameters.path.petId;
    const sound = requestBody.content.sound;

    return {
      content: {
        200: {
          "application/json": {
            greeting: `Pet ${petId} says "${sound}"`,
          },
        },
      },
    };
  },
};

export default API;
```

Set up your Express server

`app.ts`

```typescript
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRouteHandlers } from "./gen/server.ts";
import registerRoutes from "openapi-typescript-server-express";
import API from "./api.ts";
import OpenApiValidator from "express-openapi-validator";

export default function makeApp() {
  const app = express();

  app.use(express.json());

  const apiRouter = express();

  // Runtime validation (recommended)
  apiRouter.use(
    OpenApiValidator.middleware({
      apiSpec: "./spec.yaml",
      validateResponses: false,
    }),
  );

  // Register your typed route handlers
  const routeHandlers = registerRouteHandlers(API);

  // Make Express routes from your route handlers
  registerRoutes(routeHandlers, apiRouter);

  // Mount to the correct base path
  app.use("/api/v3", apiRouter);

  // Global error handler
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  });

  return app;
}
```

Test your API

```bash
curl localhost:8080/api/v3/speak/123 \
  -d '{"sound":"grrrr"}' \
  -H "Content-Type: application/json"
```

Response:

```json
{ "greeting": "Pet 123 says \"grrrr\"" }
```

### Making a change

Now, make a change to your OpenAPI spec:

```diff
 paths:
   /speak/{petId}:
     post:
       operationId: makePetSpeak
       parameters:
         - name: petId
           in: path
           description: ID of pet that will speak
           required: true
           schema:
             type: integer
       requestBody:
         required: true
         content:
           application/json:
             schema:
               type: object
               properties:
                 sound:
                   type: string
                   description: The sound the pet will make
               required:
                 - sound
       responses:
         "200":
           description: successful operation
           content:
             application/json:
               schema:
                 type: object
                 properties:
                   greeting:
                     type: string
                     description: The greeting from the pet
+                  vibe:
+                    type: string
+                    enum: ["friendly", "fierce", "playful", "sleepy"]
+                    description: The pet's current mood/vibe
                 required:
                   - greeting
+                  - vibe
```

And re-generate the types and server interface:

```bash
openapi-typescript ./spec.yaml --output ./gen/schema.d.ts && openapi-typescript-server ./spec.yaml --types ./schema.d.ts --output ./gen/server.ts
```

You'll see that TypeScript will tell you exactly what needs to change in your code to conform to the new OpenAPI spec:

```
Property 'vibe' is missing in type '{ greeting: string; }' but required in type '{ greeting: string; vibe: "friendly" | "fierce" | "playful" | "sleepy"; }'.ts(2322)
```

> **Note**: You may need to restart the TS Server in VS Code to see the TypeScript error.

Satisfy the compiler to get it working again:

```diff
 const API: ServerTypes.Server<Request, Response> = {
   makePetSpeak: async ({ parameters, requestBody }) => {
     const petId = parameters.path.petId;
     const sound = requestBody.content.sound;

     return {
       content: {
         200: {
           "application/json": {
             greeting: `Pet ${petId} says "${sound}"`,
+            vibe: "fierce",
           },
         },
       },
     };
   },
 };
```

This pattern also guides you when adding or removing routes.

## Deeper dive

### Design goals

The main goal of this package is to ensure that the server implementation stays in sync with the API documentation by generating a typed interface _from_ the OpenAPI spec.

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

### How does it work?

#### Route handling

The return value of your route handlers closely matches the structure of the OpenAPI V3 spec path response content:

```
- content:
  - response variant (status code int or "default"):
    - content type (usually "application/json"):
      - <your schema starts here>
```

The route handler name uses the `operationId` if present. Otherwise it's generated based on path and method.

The return value is enveloped in `content` so that you can provide `headers` and `status` at the same level. `status` is required when the response variant is "default".

> **Note**: These return values are a bit verbose, but, since the HTTP handling is delegated to the adapters, they have the added benefit of being easily testable functions with data in and out.

Your route handlers are packaged up into the generated `registerRouteHandlers` function which returns a list of objects containing the route method, path, and handler function.

Adapters supply a `registerRoutes` function. It iterates through this data structure and uses the underlying framework (i.e. Express) to add each route, set headers, serialize response bodies, and terminate the response.

#### Content type serialization

Content type serialization and deserialization happens in the adapter layer.

For Express, request bodies can be deserialized to JavaScript objects by middleware. The Express adapter assumes this has already happened and passes the deserialized (and presumably validated and coerced) JavaScript objects to your route handlers. The content type is passed as an argument to your handler in case you need to return a different response shape per.

For response body serialization, `application/json` is built in and happens automatically. Other content types can be handled by supplying a `serializers` option to the `registerRoutes` function with custom serialization functions keyed by content type.

```typescript
import { json2xml } from "xml-js";

...

registerRoutes(routeHandlers, apiRouter, {
  serializers: {
    "application/xml": (content) => {
      const serialized = json2xml(JSON.stringify(content), {
        compact: true,
      });
      return serialized;
    },
  },
});
```

#### Accessing the underlying request and response objects

In some cases, you may need to access the `request` or `response` objects from the underlying HTTP framework.

These are generic arguments you can access in your handler implementation:

```typescript
import type * as ServerTypes from "./gen/server.ts";
import type { Request, Response } from "express";

type DecoratedRequest = Request & {
  userId: string;
};

const API: ServerTypes.Server<DecoratedRequest, Response> = {
  makePetSpeak: async ({ parameters, requestBody, req }) => {
    const petId = parameters.path.petId;
    const sound = requestBody.content.sound;

    console.log(`The userId is: ${req.userId}`);

    return {
      content: {
        200: {
          "application/json": {
            greeting: `Pet ${petId} says "${sound}"`,
          },
        },
      },
    };
  },
};
```

#### Route paths

The Express middleware will mount paths based on the exact paths in your OpenAPI spec ignoring any base paths in `servers`. You'll need to mount the routes returned from `registerRoutes` to the right base path in your server setup.

#### Error handling

Errors can be handled directly in your route handlers by defining a "default" schema for all errors. In the route handler, return the "default" response variant and include a `status` code.

```yaml
openapi: 3.0.2
info:
  title: Simple Petstore
  version: 0.0.1
servers:
  - url: /api/v3
paths:
  /uhoh:
    get:
      operationId: uhoh
      responses:
        "default":
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        message:
          type: string
```

```typescript
import type * as ServerTypes from "./gen/server.ts";
import type { Request, Response } from "express";

type DecoratedRequest = Request & {
  userId: string;
};

const API: ServerTypes.Server<DecoratedRequest, Response> = {
  uhoh: async () => {
    return {
      content: {
        default: {
          "application/json": {
            message: "This is what it looks like when something goes wrong",
          },
        },
      },
      status: 418,
    };
  },
};

export default API;
```

Otherwise, thrown errors will propagate up the call stack to your global error handler. You can check for `err instanceof NotImplementedError` if you want to handle those with a `501 Not Implemented` status code.
