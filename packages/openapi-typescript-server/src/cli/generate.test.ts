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
        summary: "An operation that gets something",
        description: "More info about the operation",
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

const sourceFile = generate(spec, "./schema.d.ts", "outdir.ts");

it("writes imports", () => {
  const operationsImport = sourceFile.getImportDeclaration("./schema.d.ts");
  assert.equal(operationsImport?.getNamedImports()[0]?.getName(), ["paths"]);

  const serverImport = sourceFile.getImportDeclaration(
    "openapi-typescript-server-runtime",
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

    const result200Interface = sourceFile.getInterface("GetOperationResult200");
    assert.equal(
      result200Interface?.getProperty("content")?.getTypeNode()?.getText(),
      "{ 200: paths['/path']['get']['responses']['200']['content'] }",
    );

    const resultDefaultInterface = sourceFile.getInterface(
      "GetOperationResultDefault",
    );
    assert.equal(
      resultDefaultInterface?.getProperty("content")?.getTypeNode()?.getText(),
      "{ default: paths['/path']['get']['responses']['default']['content'] }",
    );
  });

  it("adds inimplemented function", () => {
    const functionDeclaration = sourceFile.getFunction(
      "getOperationUnimplemented",
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

  const jsdocText = operation.getJsDocs()[0]?.getText() || "";
  assert.match(jsdocText, /An operation that gets something/);
  assert.match(jsdocText, /@description More info about the operation/);
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

  it.only("writes function inputs and results", () => {
    const argsInterface = sourceFile.getInterface("GetSomethingIdArgs");
    assert(argsInterface);
    assert.equal(argsInterface.getTypeParameters().length, 2);

    assert.equal(
      argsInterface?.getProperty("parameters")?.getTypeNode()?.getText(),
      "paths['/something/{id}']['get']['parameters']",
    );

    const result200Interface = sourceFile.getInterface(
      "GetSomethingIdResult200",
    );
    assert.equal(
      result200Interface?.getProperty("content")?.getTypeNode()?.getText(),
      "{ 200: paths['/something/{id}']['get']['responses']['200']['content'] }",
    );

    const resultDefaultInterface = sourceFile.getInterface(
      "GetSomethingIdResultDefault",
    );
    assert.equal(
      resultDefaultInterface?.getProperty("content")?.getTypeNode()?.getText(),
      "{ default: paths['/something/{id}']['get']['responses']['default']['content'] }",
    );
  });
});

describe("tags", () => {
  it("generates Tag type with all tags from spec", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/pets": {
          get: {
            operationId: "listPets",
            tags: ["pet"],
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
        "/users": {
          get: {
            operationId: "listUsers",
            tags: ["user"],
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };
    const sourceFile = generate(spec, "./schema.d.ts", "outdir.ts");
    const tagType = sourceFile.getTypeAlias("Tag");
    assert(tagType);
    assert(tagType.isExported());
    const tagTypeText = tagType.getTypeNode()?.getText() || "";
    assert.match(tagTypeText, /"pet"/);
    assert.match(tagTypeText, /"user"/);
  });

  it("generates Tag type with null for untagged operations", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/pets": {
          get: {
            operationId: "listPets",
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };
    const sourceFile = generate(spec, "./schema.d.ts", "outdir.ts");
    const tagType = sourceFile.getTypeAlias("Tag");
    assert(tagType);
    assert(tagType.isExported());
    const tagTypeText = tagType.getTypeNode()?.getText() || "";
    assert.equal(tagTypeText, "null");
  });

  it("generates Tag type with both tags and null for mixed operations", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/pets": {
          get: {
            operationId: "listPets",
            tags: ["pet"],
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
        "/status": {
          get: {
            operationId: "getStatus",
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };
    const sourceFile = generate(spec, "./schema.d.ts", "outdir.ts");
    const tagType = sourceFile.getTypeAlias("Tag");
    assert(tagType);
    const tagTypeText = tagType.getTypeNode()?.getText() || "";
    assert.match(tagTypeText, /"pet"/);
    assert.match(tagTypeText, /null/);
  });
});

describe("registerRouteHandlersByTag", () => {
  it("generates function with correct signature", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/pets": {
          get: {
            operationId: "listPets",
            tags: ["pet"],
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };
    const sourceFile = generate(spec, "./schema.d.ts", "outdir.ts");
    const func = sourceFile.getFunction("registerRouteHandlersByTag");
    assert(func);
    assert(func.isExported());
    assert.equal(func.getTypeParameters().length, 2);
    assert.equal(func.getParameters().length, 2);

    const tagParam = func.getParameters()[0];
    assert(tagParam);
    assert.equal(tagParam.getName(), "tag");
    assert.equal(tagParam.getType().getText(), '"pet"');

    const serverParam = func.getParameters()[1];
    assert(serverParam);
    assert.equal(serverParam.getName(), "server");
    const serverTypeText = serverParam.getTypeNode()?.getText() || "";
    assert.match(serverTypeText, /Partial<Server<Req, Res>>/);

    const returnTypeText = func.getReturnTypeNode()?.getText() || "";
    assert.match(returnTypeText, /Route\[\]/);
  });

  it("generates switch statement for each tag", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/pets": {
          get: {
            operationId: "listPets",
            tags: ["pet"],
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
        "/users": {
          get: {
            operationId: "listUsers",
            tags: ["user"],
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };
    const sourceFile = generate(spec, "./schema.d.ts", "outdir.ts");
    const func = sourceFile.getFunction("registerRouteHandlersByTag");
    const bodyText = func?.getBodyText() || "";

    assert.match(bodyText, /switch \(tag\)/);
    assert.match(bodyText, /case "pet":/);
    assert.match(bodyText, /case "user":/);
    assert.match(bodyText, /handler: server\.listPets/);
    assert.match(bodyText, /handler: server\.listUsers/);
  });

  it("groups operations by tag correctly", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/pets": {
          get: {
            operationId: "listPets",
            tags: ["pet"],
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
          post: {
            operationId: "createPet",
            tags: ["pet"],
            responses: {
              201: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };
    const sourceFile = generate(spec, "./schema.d.ts", "outdir.ts");
    const func = sourceFile.getFunction("registerRouteHandlersByTag");
    const bodyText = func?.getBodyText() || "";

    // Both operations should be in the same case block
    const petCaseMatch = bodyText.match(/case "pet":[\s\S]*?break;/);
    assert(petCaseMatch);
    const petCaseBlock = petCaseMatch[0];
    assert.match(petCaseBlock, /handler: server\.listPets/);
    assert.match(petCaseBlock, /handler: server\.createPet/);
  });

  it("handles untagged operations with null case", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/status": {
          get: {
            operationId: "getStatus",
            responses: {
              200: {
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };
    const sourceFile = generate(spec, "./schema.d.ts", "outdir.ts");
    const func = sourceFile.getFunction("registerRouteHandlersByTag");
    const bodyText = func?.getBodyText() || "";

    assert.match(bodyText, /case null:/);
    assert.match(bodyText, /handler: server\.getStatus/);
  });
});

describe("request body", () => {
  it("writes required request body", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/something/{id}": {
          post: {
            operationId: "postSomething",
            requestBody: {
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
              required: true,
            },
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
            },
          },
        },
      },
    };
    const modifiedSpec = structuredClone(spec);
    const sourceFile = generate(modifiedSpec, "./schema.d.ts", "outdir");
    const argsInterface = sourceFile.getInterface("PostSomethingArgs");
    assert(argsInterface);
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /mediaType: \"application\/json\"/,
    );
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /content: paths\['\/something\/{id}']\['post']\['requestBody']\['content']\['application\/json']/,
    );
  });
  it("writes optional request body", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/something/{id}": {
          post: {
            operationId: "postSomething",
            requestBody: {
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
            },
          },
        },
      },
    };
    const modifiedSpec = structuredClone(spec);
    const sourceFile = generate(modifiedSpec, "./schema.d.ts", "outdir");
    const argsInterface = sourceFile.getInterface("PostSomethingArgs");
    assert(argsInterface);
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /mediaType: \"application\/json\"/,
    );
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /content\?: NonNullable<paths\['\/something\/{id}']\['post']\['requestBody']>\['content']\['application\/json']/,
    );
  });

  it("writes request body with multiple content types", () => {
    const spec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/something/{id}": {
          post: {
            operationId: "postSomething",
            requestBody: {
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
                "application/xml": {
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
              required: true,
            },
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
            },
          },
        },
      },
    };
    const modifiedSpec = structuredClone(spec);
    const sourceFile = generate(modifiedSpec, "./schema.d.ts", "outdir");
    const argsInterface = sourceFile.getInterface("PostSomethingArgs");
    assert(argsInterface);
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /mediaType: \"application\/json\"/,
    );
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /content: paths\['\/something\/{id}']\['post']\['requestBody']\['content']\['application\/json']/,
    );
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /\|/,
    );
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /mediaType: \"application\/xml\"/,
    );
    assert.match(
      argsInterface.getProperty("requestBody")?.getTypeNode()?.getText() || "",
      /content: paths\['\/something\/{id}']\['post']\['requestBody']\['content']\['application\/xml']/,
    );
  });
});
