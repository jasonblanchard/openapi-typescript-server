import type { Application } from "express";
import type { Route } from "openapi-typescript-server/route";

export default function routesToExpressRouter(
  routes: Route[],
  app: Application
) {
  for (const route of routes) {
    app[route.method](openAPIPathToExpress(route.path), async (req, res) => {
      const result = await route.handler({
        parameters: {
          query: req.query,
          header: req.headers,
          path: req.params,
          cookie: req.cookies,
        },
        requestBody: {
          content: {
            // TODO: Deal with content type
            "application/json": req.body,
          },
        },
        req,
        res,
      });

      for (const headerName in result.headers) {
        res.setHeader(headerName, result.headers[headerName]);
      }

      if (
        result.responseVariant.toUpperCase().includes("XX") ||
        result.responseVariant === "default"
      ) {
        res.status(result.status || 500);
      } else {
        res.status(Number(result.responseVariant));
      }

      // TODO: Handle other content types
      if (result.content?.["application/json"]) {
        res.json(result.content["application/json"]);
      }

      return;
    });
  }
}

function openAPIPathToExpress(path: string) {
  return path.replace(/{([^}]+)}/g, ":$1");
}
