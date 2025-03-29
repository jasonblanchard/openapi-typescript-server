import {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { Route } from "openapi-typescript-server";
import { NoAcceptableContentType } from "./errors.ts";

interface Options {
  serializers?: Record<
    string,
    (content: any, req: Request, res: Response) => any
  >;
}

export default function registerRoutes(
  routes: Route[],
  app: Application,
  options: Options = {},
) {
  for (const route of routes) {
    app[route.method](
      openAPIPathToExpress(route.path),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const contentType = req.headers["content-type"] || "application/json";

          const result = await route.handler({
            parameters: {
              query: req.query,
              header: req.headers,
              path: req.params,
              cookie: req.cookies,
            },
            requestBody: {
              mediaType: contentType,
              content: req.body,
            },
            contentType,
            req,
            res,
          });

          for (const headerName in result.headers) {
            res.setHeader(headerName, result.headers[headerName]);
          }

          const entry = Object.entries(result.content || {})[0];
          const [responseVariant, content] = entry ? entry : ["default", {}];

          const variantStatusCode = Number(responseVariant);

          if (!isValidStatusCode(variantStatusCode) && !result.status) {
            throw new Error(`${responseVariant} must include \`status\``);
          }

          if (result.status) {
            res.status(result.status);
          } else {
            res.status(Number(responseVariant));
          }

          if (!content) {
            res.send();
            return;
          }

          const responseContentType = req.accepts(Object.keys(content));

          if (!responseContentType) {
            throw new NoAcceptableContentType(req.headers.accept || "");
          }

          if (responseContentType === "application/json") {
            res.json(content["application/json"]);
            return;
          }

          res.type(responseContentType);

          const serializer = options.serializers?.[responseContentType];

          if (serializer) {
            const body = serializer(content[responseContentType], req, res);
            res.send(body);
            return;
          }

          res.send(content[responseContentType]);
          return;
        } catch (err) {
          next(err);
        }
      },
    );
  }
}

function openAPIPathToExpress(path: string) {
  return path.replace(/{([^}]+)}/g, ":$1");
}

function isValidStatusCode(statusCode: number) {
  return statusCode >= 100 && statusCode <= 599;
}
