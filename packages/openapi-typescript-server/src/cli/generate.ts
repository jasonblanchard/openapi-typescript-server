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
      tags?: string[];
    }
  > = {};

  const allTags = new Set<string>();

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

      // Track tags for this operation
      const operationTags = operation.tags || [];
      operationTags.forEach((tag) => allTags.add(tag));

      operationsById[operationId] = {
        path: path,
        method: method,
        args: argsInterface.getName(),
        result: resultType.getName(),
        summary: operation.summary,
        description: operation.description,
        tags: operationTags,
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

  // Generate Tag type union
  const tagValues = Array.from(allTags).map((tag) => `"${tag}"`);
  // Check if there are any untagged operations
  const hasUntaggedOperations = Object.values(operationsById).some(
    (op) => !op.tags || op.tags.length === 0,
  );
  if (hasUntaggedOperations) {
    tagValues.push("null");
  }

  if (tagValues.length > 0) {
    sourceFile.addTypeAlias({
      name: "Tag",
      isExported: true,
      type: tagValues.join(" | "),
    });
  }

  // Generate interfaces for partial servers by tag
  const tagToOperations: Record<string, string[]> = {};

  // Group operations by tag
  Object.entries(operationsById).forEach(([operationId, { tags }]) => {
    if (!tags || tags.length === 0) {
      // Untagged operations
      if (!tagToOperations["null"]) {
        tagToOperations["null"] = [];
      }
      tagToOperations["null"].push(operationId);
    } else {
      // Add operation to each tag it belongs to
      tags.forEach((tag) => {
        if (!tagToOperations[tag]) {
          tagToOperations[tag] = [];
        }
        tagToOperations[tag].push(operationId);
      });
    }
  });

  // Generate a ServerForTag interface for each tag
  Object.entries(tagToOperations).forEach(([tag, operations]) => {
    const interfaceName =
      tag === "null" ? "ServerForUntagged" : `ServerFor${capitalize(tag)}`;
    const tagInterface = sourceFile.addInterface({
      name: interfaceName,
      isExported: true,
      typeParameters: [
        { name: "Req", default: "unknown" },
        { name: "Res", default: "unknown" },
      ],
    });

    // Add only operations associated with this tag
    operations.forEach((operationId) => {
      const op = operationsById[operationId];
      if (op) {
        tagInterface.addProperty({
          name: operationId,
          type: `(args: ${op.args}<Req, Res>) => ${op.result}`,
          hasQuestionToken: true, // Make it optional since it's a partial implementation
        });
      }
    });
  });

  // Generate registerRouteHandlersByTag function with overloads
  const registerByTagFunc = sourceFile.addFunction({
    name: "registerRouteHandlersByTag",
    isExported: true,
    parameters: [
      { name: "tag", type: "Tag" },
      { name: "server", type: "Partial<Server<Req, Res>>" },
    ],
    typeParameters: [{ name: "Req" }, { name: "Res" }],
    returnType: "Route[]",
    statements: (writer) => {
      writer.writeLine("const routes: Route[] = [];");
      writer.writeLine("");

      // Generate switch statement for each tag
      if (Object.keys(tagToOperations).length > 0) {
        writer.writeLine("switch (tag) {");

        Object.entries(tagToOperations).forEach(([tag, operations]) => {
          const caseValue = tag === "null" ? "null" : `"${tag}"`;
          writer.writeLine(`case ${caseValue}:`);

          operations.forEach((operationId) => {
            const op = operationsById[operationId];
            if (op) {
              writer.writeLine(`if (server.${operationId}) {`);
              writer.writeLine("routes.push({");
              writer.writeLine(`method: "${op.method}",`);
              writer.writeLine(`path: "${op.path}",`);
              writer.writeLine(
                `handler: server.${operationId} as Route["handler"],`,
              );
              writer.writeLine("});");
              writer.writeLine("}");
            }
          });

          writer.writeLine("break;");
        });

        writer.writeLine("}");
      }

      writer.writeLine("");
      writer.writeLine("return routes;");
    },
  });

  // Add overload signatures for each tag
  Object.entries(tagToOperations).forEach(([tag, _operations]) => {
    const tagValue = tag === "null" ? "null" : `"${tag}"`;
    const interfaceName =
      tag === "null" ? "ServerForUntagged" : `ServerFor${capitalize(tag)}`;

    registerByTagFunc.addOverload({
      parameters: [
        { name: "tag", type: tagValue },
        { name: "server", type: `Partial<${interfaceName}<Req, Res>>` },
      ],
      typeParameters: [{ name: "Req" }, { name: "Res" }],
      returnType: "Route[]",
    });
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
