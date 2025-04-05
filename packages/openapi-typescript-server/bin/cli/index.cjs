#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/cli/index.ts
var import_commander = require("commander");
var import_fs = __toESM(require("fs"), 1);

// src/lib/schema.ts
var import_zod = __toESM(require("zod"), 1);
var bastSchema = import_zod.default.object({
  $ref: import_zod.default.string().optional(),
  type: import_zod.default.string().optional(),
  // Actually a set of known literals. Can probably do a discriminated union instead of making the types optional
  required: import_zod.default.array(import_zod.default.string()).optional()
});
var Schema = bastSchema.extend({
  properties: import_zod.default.lazy(() => import_zod.default.record(Schema).optional())
});
var OpenAPISpec = import_zod.default.object({
  openapi: import_zod.default.string(),
  info: import_zod.default.object({
    title: import_zod.default.string().optional(),
    version: import_zod.default.string().optional()
  }),
  paths: import_zod.default.record(
    import_zod.default.record(
      import_zod.default.object({
        summary: import_zod.default.string().optional(),
        operationId: import_zod.default.string().optional(),
        parameters: import_zod.default.array(
          import_zod.default.object({
            name: import_zod.default.string(),
            in: import_zod.default.string(),
            required: import_zod.default.boolean().optional(),
            schema: import_zod.default.object({
              type: import_zod.default.string()
            })
          })
        ).optional(),
        requestBody: import_zod.default.object({
          description: import_zod.default.string().optional(),
          required: import_zod.default.boolean().optional(),
          content: import_zod.default.record(
            import_zod.default.object({
              schema: Schema
            })
          )
        }).optional(),
        responses: import_zod.default.record(
          import_zod.default.object({
            description: import_zod.default.string().optional(),
            content: import_zod.default.record(
              import_zod.default.object({
                schema: Schema
              })
            ).optional()
          })
        )
      })
    )
  )
});

// src/cli/index.ts
var import_js_yaml = __toESM(require("js-yaml"), 1);

// src/cli/generate.ts
var import_ts_morph = require("ts-morph");
function generate(spec, types, outdir) {
  const project = new import_ts_morph.Project();
  const sourceFile = project.createSourceFile(`${outdir}/server.ts`, "", {
    overwrite: true
  });
  sourceFile.addImportDeclaration({
    namedImports: ["paths"],
    moduleSpecifier: types,
    isTypeOnly: true
  });
  sourceFile.addImportDeclaration({
    namedImports: ["Route"],
    moduleSpecifier: "openapi-typescript-server",
    isTypeOnly: true
  });
  sourceFile.addImportDeclaration({
    namedImports: ["NotImplementedError"],
    moduleSpecifier: "openapi-typescript-server"
  });
  const operationsById = {};
  for (const path in spec.paths) {
    const pathSpec = spec.paths[path];
    for (const method in pathSpec) {
      const operation = pathSpec[method];
      if (!operation) {
        throw new Error("no operation");
      }
      const operationId = getOperationId({
        operationId: operation.operationId,
        path,
        method
      });
      const argProperties = [
        {
          name: "parameters",
          type: `paths['${path}']['${method}']['parameters']`
        },
        {
          name: "contentType",
          type: "string"
        },
        {
          name: "req",
          type: "Req"
        },
        {
          name: "res",
          type: "Res"
        }
      ];
      if (operation.requestBody) {
        const type = Object.keys(operation.requestBody.content).map((key) => {
          var _a;
          if ((_a = operation.requestBody) == null ? void 0 : _a.required) {
            return `{
  mediaType: "${key}";
  content: paths['${path}']['${method}']['requestBody']['content']['${key}']
}
`;
          }
          return `{
  mediaType: "${key}";
  content?: NonNullable<paths['${path}']['${method}']['requestBody']>['content']['${key}']
}
`;
        }).join(" | ");
        argProperties.push({
          name: "requestBody",
          type
        });
      }
      const argsInterface = sourceFile.addInterface({
        name: `${capitalize(operationId)}Args`,
        isExported: true,
        typeParameters: [{ name: "Req" }, { name: "Res" }],
        properties: argProperties
      });
      const responseVariantInterfaceNames = [];
      for (const responseVariant in operation.responses) {
        const responseVariantProperties = [
          {
            name: "content",
            type: `{${responseVariant}: paths['${path}']['${method}']['responses']['${responseVariant}']['content']}`
          },
          {
            name: "headers",
            type: "{ [name: string]: any }",
            hasQuestionToken: true
          }
        ];
        if (responseVariant === "default" || responseVariant.includes("XX")) {
          responseVariantProperties.push({
            name: "status",
            type: "number"
          });
        }
        const responseVariantInterface = sourceFile.addInterface({
          name: `${capitalize(operationId)}Result${capitalize(
            responseVariant
          )}`,
          properties: responseVariantProperties
        });
        responseVariantInterfaceNames.push(responseVariantInterface.getName());
      }
      const resultType = sourceFile.addTypeAlias({
        name: `${capitalize(operationId)}Result`,
        isExported: true,
        type: `Promise<${responseVariantInterfaceNames.join(" | ")}>`
      });
      operationsById[operationId] = {
        path,
        method,
        args: argsInterface.getName(),
        result: resultType.getName()
      };
      sourceFile.addFunction({
        name: `${operationId}Unimplemented`,
        isExported: true,
        isAsync: true,
        returnType: resultType.getName(),
        statements: (writer) => {
          writer.writeLine("throw new NotImplementedError()");
        }
      });
    }
  }
  const serverInferfaceProperties = Object.entries(operationsById).map(
    ([operationId, { args, result }]) => {
      return {
        name: operationId,
        type: `(
          args: ${args}<Req, Res>
          ) => ${result}`
      };
    }
  );
  const serverInterface = sourceFile.addInterface({
    name: "Server",
    isExported: true,
    typeParameters: [
      { name: "Req", default: "unknown" },
      { name: "Res", default: "unknown" }
    ],
    properties: serverInferfaceProperties
  });
  sourceFile.addFunction({
    name: "registerRouteHandlers",
    isExported: true,
    parameters: [
      { name: "server", type: `${serverInterface.getName()}<Req, Res>` }
    ],
    typeParameters: [{ name: "Req" }, { name: "Res" }],
    returnType: "Route[]",
    statements: (writer) => {
      writer.writeLine("return [");
      Object.entries(operationsById).forEach(
        ([operationId, { path, method }]) => {
          writer.writeLine("{");
          writer.writeLine(`method: "${method}",`);
          writer.writeLine(`path: "${path}",`);
          writer.writeLine(`handler: server.${operationId},`);
          writer.writeLine("},");
        }
      );
      writer.writeLine("]");
    }
  });
  sourceFile.insertText(
    0,
    `/**
 * This file was auto-generated by openapi-typescript-server.
 * Do not make direct changes to the file.
 */

  `
  );
  sourceFile.formatText({
    indentMultiLineObjectLiteralBeginningOnBlankLine: true,
    ensureNewLineAtEndOfFile: true,
    indentSize: 2
  });
  return sourceFile;
}
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function getOperationId({
  operationId,
  path,
  method
}) {
  if (operationId) {
    return operationId;
  }
  const pathParts = path.replace("{", "").replace("}", "").split("/").map((part) => capitalize(part)).join("");
  return `${method}${pathParts}`;
}

// src/cli/index.ts
var program = new import_commander.Command();
program.name("openapi-typescript-server").description("CLI to generate Open API server stub").version(process.env.npm_package_version || "unknown").argument("<spec>", "Path to Open API spec file").description("Output generated code").option(
  "-t, --types <types>",
  "Import path (relative to generated output) for type schema generated by open-api-typescript"
).option("-o, --output <dir>", "output directory", "").action((spec, options) => __async(void 0, null, function* () {
  let specS = "";
  try {
    specS = import_fs.default.readFileSync(spec, "utf-8");
  } catch (e) {
    console.error("Error reading spec file", e.message);
    process.exit(1);
  }
  const specPojo = import_js_yaml.default.load(specS);
  const validateSpecResponse = OpenAPISpec.safeParse(specPojo);
  if (!validateSpecResponse.success) {
    console.error(validateSpecResponse.error.errors);
    return;
  }
  const sourceFile = generate(
    validateSpecResponse.data,
    options.types,
    options.output
  );
  if (options.output) {
    sourceFile.saveSync();
    return;
  }
  console.log(sourceFile.print());
}));
program.parse();
