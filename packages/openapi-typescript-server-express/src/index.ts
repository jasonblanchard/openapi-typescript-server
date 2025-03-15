import type { Application, Request, Response } from "express";
import type { Route } from "openapi-typescript-server";

export default function registerRoutes(routes: Route[], app: Application) {
  for (const route of routes) {
    app[route.method](
      openAPIPathToExpress(route.path),
      async (req: Request, res: Response) => {
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

        const entry = Object.entries(result.content || {})[0];
        const [responseVariant, content] = entry ? entry : ["default", {}];

        if (result.status) {
          res.status(result.status);
        } else {
          res.status(Number(responseVariant));
        }

        // TODO: Handle other content types
        if (content?.["application/json"]) {
          res.json(content["application/json"]);
          return;
        }

        res.end();
        return;
      },
    );
  }
}

function openAPIPathToExpress(path: string) {
  return path.replace(/{([^}]+)}/g, ":$1");
}
