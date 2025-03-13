import type { OpenAPISpec } from "../lib/schema";
import { Project } from "ts-morph";

export default function generate(
  spec: OpenAPISpec,
  types: string,
  outdir: string
) {
  const project = new Project();

  const sourceFile = project.createSourceFile(`${outdir}/server.ts`, "", {
    overwrite: true,
  });

  sourceFile.addImportDeclaration({
    namedImports: ["operations"],
    moduleSpecifier: types,
    isTypeOnly: true,
  });

  sourceFile.addImportDeclaration({
    namedImports: ["Route"],
    moduleSpecifier: "openapi-typescript-server",
    isTypeOnly: true,
  });

  const operationsById: Record<
    string,
    { path: string; method: string; args: string; result: string }
  > = {};

  for (const path in spec.paths) {
    const pathSpec = spec.paths[path];
    for (const method in pathSpec) {
      const operation = pathSpec[method];
      if (!operation?.operationId) {
        throw new Error("Operation without operationId not implemented");
      }

      const argsInterface = sourceFile.addInterface({
        name: `${capitalize(operation.operationId)}Args`,
        isExported: true,
        typeParameters: [{ name: "Req" }, { name: "Res" }],
        properties: [
          {
            name: "parameters",
            type: `operations['${operation.operationId}']['parameters']`,
          },
          {
            name: "requestBody",
            type: `operations['${operation.operationId}']['requestBody']`,
          },
          {
            name: "req",
            type: "Req",
          },
          {
            name: "res",
            type: "Res",
          },
        ],
      });

      const responseVariantInterfaceNames: string[] = [];

      for (const responseVariant in operation.responses) {
        const responseVariantProperties = [
          {
            name: "content",
            type: `{${responseVariant}: operations['${operation.operationId}']['responses']['${responseVariant}']['content']}`,
          },
          {
            name: "headers",
            type: "{ [name: string]: any }",
            hasQuestionToken: true,
          },
        ];

        if (responseVariant === "default" || responseVariant.includes("XX")) {
          responseVariantProperties.push({
            name: "status",
            type: "number",
          });
        }
        const responseVariantInterface = sourceFile.addInterface({
          name: `${capitalize(operation.operationId)}Result_${responseVariant}`,
          properties: responseVariantProperties,
        });

        responseVariantInterfaceNames.push(responseVariantInterface.getName());
      }

      const resultType = sourceFile.addTypeAlias({
        name: `${capitalize(operation.operationId)}Result`,
        isExported: true,
        type: `Promise<${responseVariantInterfaceNames.join(" | ")}>`,
      });

      operationsById[operation.operationId] = {
        path: path,
        method: method,
        args: argsInterface.getName(),
        result: resultType.getName(),
      };
    }
  }

  const serverInferfaceProperties = Object.entries(operationsById).map(
    ([operationId, { args, result }]) => {
      return {
        name: operationId,
        type: `(
          args: ${args}<Req, Res>
          ) => ${result}`,
      };
    }
  );

  const serverInterface = sourceFile.addInterface({
    name: "Server",
    isExported: true,
    typeParameters: [
      { name: "Req", default: "unknown" },
      { name: "Res", default: "unknown" },
    ],
    properties: serverInferfaceProperties,
  });

  sourceFile.addFunction({
    name: "registerRouteHandlers",
    isExported: true,
    parameters: [
      { name: "server", type: `${serverInterface.getName()}<Req, Res>` },
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
    },
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
    indentSize: 2,
  });
  sourceFile.saveSync();
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
