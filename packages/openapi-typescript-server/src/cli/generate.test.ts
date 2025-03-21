import { describe, it } from "node:test";
import assert from "node:assert";
import generate from "./generate.ts";

const spec = {
  openapi: "3.0.0",
  info: {},
  paths: {
    "/path": {
      get: {
        operationId: "getOperation",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          default: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const sourceFile = generate(spec, "./schema.d.ts", "outdir");

it("writes imports", () => {
  const operationsImport = sourceFile.getImportDeclaration("./schema.d.ts");
  assert.equal(operationsImport?.getNamedImports()[0]?.getName(), ["paths"]);

  const serverImport = sourceFile.getImportDeclaration(
    "openapi-typescript-server",
  );
  assert.equal(serverImport?.getNamedImports()[0]?.getName(), ["Route"]);
});

describe("with operationId", () => {
  it("writes function inputs and results", () => {
    const argsInterface = sourceFile.getInterface("GetOperationArgs");
    assert.equal(argsInterface?.getTypeParameters().length, 2);
    assert.equal(
      argsInterface?.getProperty("parameters")?.getTypeNode()?.getText(),
      "paths['/path']['get']['parameters']",
    );
    assert.equal(
      argsInterface?.getProperty("requestBody")?.getTypeNode()?.getText(),
      "paths['/path']['get']['requestBody']",
    );

    const result200Interface = sourceFile.getInterface(
      "GetOperationResult_200",
    );
    assert.equal(
      result200Interface?.getProperty("content")?.getTypeNode()?.getText(),
      "{ 200: paths['/path']['get']['responses']['200']['content'] }",
    );

    const resultDefaultInterface = sourceFile.getInterface(
      "GetOperationResult_default",
    );
    assert.equal(
      resultDefaultInterface?.getProperty("content")?.getTypeNode()?.getText(),
      "{ default: paths['/path']['get']['responses']['default']['content'] }",
    );
  });

  it("adds inimplemented function", () => {
    const functionDeclaration = sourceFile.getFunction(
      "getOperation_unimplemented",
    );
    assert(functionDeclaration);
    assert.match(
      functionDeclaration.getReturnType().getText(),
      /GetOperationResult/,
    );
    assert.equal(
      functionDeclaration.getBodyText(),
      "throw new NotImplementedError()",
    );
  });
});

it("writes Server interface", () => {
  const serverInterface = sourceFile.getInterface("Server");
  assert(serverInterface);
  assert(serverInterface.isExported());
  assert.equal(serverInterface.getTypeParameters().length, 2);
  assert.equal(serverInterface.getMembers().length, 1);
  const operation = serverInterface.getMembers()[0];
  assert(operation);
  assert.match(operation.getType().getText(), /GetOperationArgs<Req, Res>/);
  assert.match(operation.getType().getText(), /GetOperationResult/);
});

it("writes register handler", () => {
  const registerRouteHandlersFunction = sourceFile.getFunction(
    "registerRouteHandlers",
  );
  assert(registerRouteHandlersFunction);
  assert(registerRouteHandlersFunction.isExported());
  assert.equal(registerRouteHandlersFunction.getTypeParameters().length, 2);
  assert.equal(registerRouteHandlersFunction.getParameters().length, 1);
  const parameter = registerRouteHandlersFunction.getParameters()[0];
  assert(parameter);
  assert.equal(parameter.getName(), "server");
  assert.match(parameter.getType().getText(), /Server<Req, Res>/);
  assert.match(
    registerRouteHandlersFunction.getReturnType().getText(),
    /Route\[\]/,
  );

  const bodyText = registerRouteHandlersFunction.getBodyText();
  assert(bodyText);
  assert.match(bodyText, /return \[/);
  assert.match(bodyText, /method: "get"/);
  assert.match(bodyText, /path: "\/path"/);
  assert.match(bodyText, /handler: server.getOperation/);
  assert.match(bodyText, /\]/);
});

describe("wihout operationId", () => {
  const spec = {
    openapi: "3.0.0",
    info: {},
    paths: {
      "/something/{id}": {
        get: {
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            default: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  const modifiedSpec = structuredClone(spec);
  const sourceFile = generate(modifiedSpec, "./schema.d.ts", "outdir");

  it("writes function inputs and results", () => {
    const argsInterface = sourceFile.getInterface("GetSomethingIdArgs");
    assert(argsInterface);
    assert.equal(argsInterface.getTypeParameters().length, 2);

    assert.equal(
      argsInterface?.getProperty("parameters")?.getTypeNode()?.getText(),
      "paths['/something/{id}']['get']['parameters']",
    );
    assert.equal(
      argsInterface?.getProperty("requestBody")?.getTypeNode()?.getText(),
      "paths['/something/{id}']['get']['requestBody']",
    );

    const result200Interface = sourceFile.getInterface(
      "GetSomethingIdResult_200",
    );
    assert.equal(
      result200Interface?.getProperty("content")?.getTypeNode()?.getText(),
      "{ 200: paths['/something/{id}']['get']['responses']['200']['content'] }",
    );

    const resultDefaultInterface = sourceFile.getInterface(
      "GetSomethingIdResult_default",
    );
    assert.equal(
      resultDefaultInterface?.getProperty("content")?.getTypeNode()?.getText(),
      "{ default: paths['/something/{id}']['get']['responses']['default']['content'] }",
    );
  });
});
