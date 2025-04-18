import type { OpenAPISpec } from "openapi-typescript-server-runtime";
import { Project } from "ts-morph";

export default function generate(
  spec: OpenAPISpec,
  types: string,
  outpath: string,
  version?: string,
) {
  const project = new Project();

  const sourceFile = project.createSourceFile(outpath, "", {
    overwrite: true,
  });

  sourceFile.addImportDeclaration({
    namedImports: ["paths"],
    moduleSpecifier: types,
    isTypeOnly: true,
  });

  sourceFile.addImportDeclaration({
    namedImports: ["Route"],
    moduleSpecifier: "openapi-typescript-server-runtime",
    isTypeOnly: true,
  });

  sourceFile.addImportDeclaration({
    namedImports: ["NotImplementedError"],
    moduleSpecifier: "openapi-typescript-server-runtime",
  });

  const operationsById: Record<
    string,
    {
      path: string;
      method: string;
      args: string;
      result: string;
      summary?: string;
      description?: string;
    }
  > = {};

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
        method,
      });

      const argProperties = [
        {
          name: "parameters",
          type: `paths['${path}']['${method}']['parameters']`,
        },
        {
          name: "contentType",
          type: "string",
        },
        {
          name: "req",
          type: "Req",
        },
        {
          name: "res",
          type: "Res",
        },
      ];

      if (operation.requestBody) {
        const type = Object.keys(operation.requestBody.content)
          .map((key) => {
            if (operation.requestBody?.required) {
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
          })
          .join(" | ");

        argProperties.push({
          name: "requestBody",
          type,
        });
      }

      const argsInterface = sourceFile.addInterface({
        name: `${capitalize(operationId)}Args`,
        isExported: true,
        typeParameters: [{ name: "Req" }, { name: "Res" }],
        properties: argProperties,
      });

      const responseVariantInterfaceNames: string[] = [];

      for (const responseVariant in operation.responses) {
        const responseVariantProperties = [
          {
            name: "content",
            type: `{${responseVariant}: paths['${path}']['${method}']['responses']['${responseVariant}']['content']}`,
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
          name: `${capitalize(operationId)}Result${capitalize(
            responseVariant,
          )}`,
          properties: responseVariantProperties,
        });

        responseVariantInterfaceNames.push(responseVariantInterface.getName());
      }

      const resultType = sourceFile.addTypeAlias({
        name: `${capitalize(operationId)}Result`,
        isExported: true,
        type: `Promise<${responseVariantInterfaceNames.join(" | ")}>`,
      });

      operationsById[operationId] = {
        path: path,
        method: method,
        args: argsInterface.getName(),
        result: resultType.getName(),
        summary: operation.summary,
        description: operation.description,
      };

      sourceFile.addFunction({
        name: `${operationId}Unimplemented`,
        isExported: true,
        isAsync: true,
        returnType: resultType.getName(),
        statements: (writer) => {
          writer.writeLine("throw new NotImplementedError()");
        },
      });
    }
  }

  const serverInterface = sourceFile.addInterface({
    name: "Server",
    isExported: true,
    typeParameters: [
      { name: "Req", default: "unknown" },
      { name: "Res", default: "unknown" },
    ],
  });

  Object.entries(operationsById).forEach(
    ([operationId, { args, result, summary, description }]) => {
      const p = serverInterface.addProperty({
        name: operationId,
        type: `(
          args: ${args}<Req, Res>
          ) => ${result}`,
      });

      if (summary || description) {
        let buffer = summary || "";

        if (summary && description) {
          buffer += "\n\n";
        }
        if (description) {
          buffer += `@description ${description}`;
        }

        p.addJsDoc({
          description: buffer,
        });
      }
    },
  );

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
          writer.writeLine(
            `handler: server.${operationId} as Route["handler"],`,
          );
          writer.writeLine("},");
        },
      );

      writer.writeLine("]");
    },
  });

  sourceFile.insertText(
    0,
    `/**
 * This file was auto-generated by openapi-typescript-server@${version || "unknown"}.
 * Do not make direct changes to the file.
 */

  `,
  );

  sourceFile.formatText({
    indentMultiLineObjectLiteralBeginningOnBlankLine: true,
    ensureNewLineAtEndOfFile: true,
    indentSize: 2,
  });

  return sourceFile;
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getOperationId({
  operationId,
  path,
  method,
}: {
  operationId?: string;
  path: string;
  method: string;
}) {
  if (operationId) {
    return operationId;
  }

  const pathParts = path
    .replace("{", "")
    .replace("}", "")
    .split("/")
    .map((part) => capitalize(part))
    .join("");

  return `${method}${pathParts}`;
}
