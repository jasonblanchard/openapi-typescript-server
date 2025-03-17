import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import express from "express";
import type { Application } from "express";
import request from "supertest";
import registerRoutes from "./index.ts";

let app: Application;

beforeEach(() => {
  app = express();
  app.use(express.json());
});

describe("status code responses", () => {
  it("GET return 200 with response body", async () => {
    registerRoutes(
      [
        {
          path: "/foo",
          method: "get",
          handler: async () => {
            return {
              content: {
                200: {
                  "application/json": { status: "ok" },
                },
              },
              headers: {},
            };
          },
        },
      ],
      app,
    );
    const response = await request(app)
      .get("/foo")
      .set("Accept", "application/json");
    assert.strictEqual(response.status, 200);
    assert.deepEqual(response.body, { status: "ok" });
  });

  it("POST return 200 with response body", async () => {
    registerRoutes(
      [
        {
          path: "/foo",
          method: "post",
          handler: async () => {
            return {
              content: {
                200: {
                  "application/json": { status: "ok" },
                },
              },
              headers: {},
            };
          },
        },
      ],
      app,
    );
    const response = await request(app)
      .post("/foo")
      .set("Accept", "application/json");
    assert.strictEqual(response.status, 200);
    assert.deepEqual(response.body, { status: "ok" });
  });
});

describe("non status code responses", () => {
  it("throws error if non status code response does not have status", async () => {
    registerRoutes(
      [
        {
          path: "/foo",
          method: "get",
          handler: async () => {
            return {
              content: {
                default: {
                  "application/json": { status: "ok" },
                },
              },
              headers: {},
            };
          },
        },
      ],
      app,
    );
    const response = await request(app)
      .get("/foo")
      .set("Accept", "application/json");
    assert.strictEqual(response.status, 500);
  });
  it("handles status for default routes", async () => {
    registerRoutes(
      [
        {
          path: "/foo",
          method: "get",
          handler: async () => {
            return {
              status: 501,
              content: {
                default: {
                  "application/json": { status: "ok" },
                },
              },
              headers: {},
            };
          },
        },
      ],
      app,
    );
    const response = await request(app)
      .get("/foo")
      .set("Accept", "application/json");
    assert.strictEqual(response.status, 501);
    assert.deepEqual(response.body, { status: "ok" });
  });

  it("handles status for 5xx routes", async () => {
    registerRoutes(
      [
        {
          path: "/foo",
          method: "get",
          handler: async () => {
            return {
              status: 501,
              content: {
                "5xx": {
                  "application/json": { status: "ok" },
                },
              },
              headers: {},
            };
          },
        },
      ],
      app,
    );
    const response = await request(app)
      .get("/foo")
      .set("Accept", "application/json");
    assert.strictEqual(response.status, 501);
    assert.deepEqual(response.body, { status: "ok" });
  });
});

describe("adds headers", () => {
  it("adds headers to the response", async () => {
    registerRoutes(
      [
        {
          path: "/foo",
          method: "get",
          handler: async () => {
            return {
              content: {
                200: {
                  "application/json": { status: "ok" },
                },
              },
              headers: {
                "x-test-header": "set",
              },
            };
          },
        },
      ],
      app,
    );
    const response = await request(app)
      .get("/foo")
      .set("Accept", "application/json");
    assert.strictEqual(response.headers["x-test-header"], "set");
  });
});

it("routes terminated before mounted handlers win", async () => {
  app.get("/foo", (_, res) => {
    res.json({ status: "ok" });
  });

  registerRoutes(
    [
      {
        path: "/foo",
        method: "get",
        handler: async () => {
          throw new Error("This should not be called");
        },
      },
    ],
    app,
  );
  const response = await request(app)
    .get("/foo")
    .set("Accept", "application/json");
  assert.strictEqual(response.status, 200);
  assert.deepEqual(response.body, { status: "ok" });
});
