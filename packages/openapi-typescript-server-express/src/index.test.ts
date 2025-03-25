import { describe, it, beforeEach, before } from "node:test";
import assert from "node:assert";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import type { Application } from "express";
import request from "supertest";
import registerRoutes from "./index.ts";
import { json2xml } from "xml-js";
import {
  NoAcceptableContentType,
  MissingResponseSerializer,
} from "./errors.ts";

let app: Application;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
      type: "application/x-www-form-urlencoded",
    }),
  );
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

describe("content types", () => {
  beforeEach(() => {
    registerRoutes(
      [
        {
          path: "/foo",
          method: "post",
          handler: async ({ requestBody, contentType }) => {
            let source = "";
            const { greeting } = requestBody.content;

            if (contentType === "application/x-www-form-urlencoded") {
              source = `${greeting} from urlencoded`;
            }

            if (contentType === "application/json") {
              source = `${greeting} from json`;
            }

            return {
              content: {
                200: {
                  "application/json": {
                    source,
                  },
                },
              },
            };
          },
        },
      ],
      app,
    );
  });

  it("handles json by default", async () => {
    const response = await request(app)
      .post("/foo")
      .set("Accept", "application/json")
      .send({ greeting: "hello" });
    assert.strictEqual(response.status, 200);
    assert.deepEqual(response.body, {
      source: "hello from json",
    });
  });

  it("handles urlencoded", async () => {
    const response = await request(app)
      .post("/foo")
      .set("Accept", "application/json")
      .type("application/x-www-form-urlencoded")
      .send("greeting=hello");
    assert.strictEqual(response.status, 200);
    assert.deepEqual(response.body, {
      source: "hello from urlencoded",
    });
  });
});

describe("accepts", () => {
  describe("happy paths", () => {
    beforeEach(() => {
      registerRoutes(
        [
          {
            path: "/foo",
            method: "post",
            handler: async () => {
              return {
                content: {
                  200: {
                    "application/json": {
                      data: "json",
                    },
                    "application/xml": {
                      data: "xml",
                    },
                  },
                },
              };
            },
          },
        ],
        app,
        {
          serializers: {
            "application/xml": (content) => {
              const serialized = json2xml(JSON.stringify(content), {
                compact: true,
              });
              return serialized;
            },
          },
        },
      );
    });

    it("returns json by default", async () => {
      const response = await request(app)
        .post("/foo")
        .send({ greeting: "hello" });
      assert.strictEqual(response.status, 200);
      assert.deepEqual(response.body, {
        data: "json",
      });
      assert.match(response.headers["content-type"] || "", /application\/json/);
    });

    it("returns xml", (_, done) => {
      request(app)
        .post("/foo")
        .send({ greeting: "hello" })
        .set("Accept", "application/xml")
        .buffer()
        .end(function (_, response) {
          assert.strictEqual(response.status, 200);
          assert.equal(response.text, "<data>xml</data>");
          assert.match(
            response.headers["content-type"] || "",
            /application\/xml/,
          );
          done();
        });
    });
  });

  describe("errors", () => {
    beforeEach(() => {
      registerRoutes(
        [
          {
            path: "/foo",
            method: "post",
            handler: async () => {
              return {
                content: {
                  200: {
                    "application/json": {
                      data: "json",
                    },
                    "application/xml": {
                      data: "xml",
                    },
                  },
                },
              };
            },
          },
        ],
        app,
      );

      app.use(
        (err: Error, _req: Request, res: Response, _next: NextFunction) => {
          if (err instanceof NoAcceptableContentType) {
            res.status(406).json({
              message: err.message,
            });
          }

          if (err instanceof MissingResponseSerializer) {
            res.status(406).json({
              message: err.message,
            });
          }

          res.status(500).send();
        },
      );
    });

    it("returns error if no acceptable content type", async () => {
      const response = await request(app)
        .post("/foo")
        .set("Accept", "application/asdf");
      assert.strictEqual(response.status, 406);
      assert.deepEqual(response.body, {
        message: "No acceptable content type for Accept: application/asdf",
      });
    });

    it("returns error if no serializer", async () => {
      const response = await request(app)
        .post("/foo")
        .set("Accept", "application/xml");
      assert.strictEqual(response.status, 406);
      assert.deepEqual(response.body, {
        message: "Missing serializer for application/xml",
      });
    });
  });
});
