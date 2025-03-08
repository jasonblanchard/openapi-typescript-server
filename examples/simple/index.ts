import express from "express";
import { registerServerHandlers } from "./gen/server.ts";
import routesToExpressRouter from "openapi-typesript-server-express/adapter.ts";
import Service from "./service.ts";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

const apiRouter = express();
routesToExpressRouter(registerServerHandlers(Service), apiRouter);

app.use("/api/v3", apiRouter);

app.listen(8080, () => {
  console.log("App running on port 8080");
});
