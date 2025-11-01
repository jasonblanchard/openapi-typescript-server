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

describe("listUsers", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .get("/api/v3/users")
      .set("Accept", "application/json");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      users: [
        { id: 1, username: "john_doe", email: "john@example.com" },
        { id: 2, username: "jane_smith", email: "jane@example.com" },
      ],
    });
  });
});

describe("listPets", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .get("/api/v3/pets")
      .set("Accept", "application/json");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      pets: [
        { id: 1, name: "dog" },
        { id: 2, name: "cat" },
      ],
    });
  });
});

describe("getInventory", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .get("/api/v3/store/inventory")
      .set("Accept", "application/json");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      inventory: {
        available: 10,
        pending: 5,
        sold: 3,
      },
    });
  });
});

describe("placeOrder", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .post("/api/v3/store/order")
      .set("Accept", "application/json")
      .send({ petId: 123, quantity: 2 });

    assert.equal(response.status, 200);
    assert(response.body.order);
    assert.equal(response.body.order.petId, 123);
    assert.equal(response.body.order.quantity, 2);
    assert.equal(response.body.order.status, "placed");
    assert(typeof response.body.order.id === "number");
  });
});
