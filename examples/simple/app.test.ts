import { describe, it } from "node:test";
import assert from "node:assert";
import makeApp from "./app.ts";
import request from "supertest";

const app = makeApp();

describe("getPetById", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .get("/api/v3/pet/123")
      .set("Accept", "application/json");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      pet: {
        id: 123,
        name: "dog",
      },
    });
  });

  it("returns 503 via default response and custom status code", async () => {
    const response = await request(app)
      .get("/api/v3/pet/42")
      .set("Accept", "application/json");

    assert.equal(response.status, 503);
    assert.deepEqual(response.body, {
      message: "Cannot get that pet",
    });
  });

  it("returns 500 from thrown errors via propagation to global error handler", async () => {
    const response = await request(app)
      .get("/api/v3/pet/500")
      .set("Accept", "application/json");

    assert.equal(response.status, 500);
  });
});

describe("updatePetWithForm", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .post("/api/v3/pet/123?name=cat")
      .set("Accept", "application/json")
      .send({ status: "sold" });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      pet: {
        id: 123,
        name: "cat",
        status: "sold",
      },
    });
  });
});
