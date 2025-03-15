import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRouteHandlers } from "./gen/server.ts";
import registerRoutes from "openapi-typescript-server-express";
import API from "./api.ts";
import OpenApiValidator from "express-openapi-validator";
import { NotImplementedError } from "openapi-typescript-server";

export default function makeApp() {
  const app = express();

  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  app.use(express.json());

  const apiRouter = express();

  apiRouter.use(
    OpenApiValidator.middleware({
      apiSpec: "./examples/simple/spec.yaml",
      validateResponses: false,
    }),
  );
  registerRoutes(registerRouteHandlers(API), apiRouter);

  app.use("/api/v3", apiRouter);

  interface ValidationError extends Error {
    status?: number;
    errors?: Record<string, unknown>[];
  }

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    const validationError = err as ValidationError;
    if (validationError.status && validationError.errors) {
      res.status(validationError.status || 500).json({
        message: validationError.message,
        errors: validationError.errors,
      });
      return;
    }

    if (err instanceof NotImplementedError) {
      res.status(501).json({
        message: "Not Implemented",
      });
      return;
    }

    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  });

  return app;
}
