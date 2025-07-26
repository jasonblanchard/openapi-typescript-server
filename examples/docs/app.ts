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

  // Make Express routes from your route handlers.
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
