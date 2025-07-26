import { describe, it } from "node:test";
import assert from "node:assert";
import makeApp from "./app.ts";
import request from "supertest";

const app = makeApp();

describe("makePetSpeak", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .post("/api/v3/speak/123")
      .set("Accept", "application/json")
      .send({ sound: "grrrr" });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      greeting: 'Pet 123 says "grrrr"',
    });
  });
});

describe("uhoh", async () => {
  it("returns 418", async () => {
    const response = await request(app).get("/api/v3/uhoh");

    assert.equal(response.status, 418);
    assert.deepEqual(response.body, {
      message: "This is what it looks like when something goes wrong",
    });
  });
});
