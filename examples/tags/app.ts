import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRouteHandlersByTag } from "./gen/server.ts";
import registerRoutes from "openapi-typescript-server-express";
import { petsService, storeService, untaggedService } from "./api.ts";
import OpenApiValidator from "express-openapi-validator";
import { NotImplementedError } from "openapi-typescript-server-runtime";

export default function makeApp() {
  const app = express();

  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const apiRouter = express();

  apiRouter.use(
    OpenApiValidator.middleware({
      apiSpec: "./openapi.yaml",
      validateResponses: false,
    }),
  );

  // Register routes by tag using registerRouteHandlersByTag
  const petsRoutes = registerRouteHandlersByTag("pets", petsService);
  const storeRoutes = registerRouteHandlersByTag("store", storeService);
  const untaggedRoutes = registerRouteHandlersByTag(null, untaggedService);

  registerRoutes([...petsRoutes, ...storeRoutes, ...untaggedRoutes], apiRouter);

  app.use("/api/v3", apiRouter);

  interface ValidationError extends Error {
    status?: number;
    errors?: Record<string, unknown>[];
  }

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error("+++", err);

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
