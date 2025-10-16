import { describe, it } from "node:test";
import assert from "node:assert";
import makeApp from "./app.ts";
import request from "supertest";
import { json2xml } from "xml-js";

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

  it("accepts xml input", async () => {
    const xmlData = json2xml(JSON.stringify({ status: "sold" }), {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    });

    const response = await request(app)
      .post("/api/v3/pet/123?name=cat")
      .set("Content-Type", "application/xml")
      .send(xmlData);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      pet: {
        id: 123,
        name: "cat",
        status: "sold",
      },
    });
  });

  it("accepts form-urlencoded input", async () => {
    const response = await request(app)
      .post("/api/v3/pet/123?name=cat")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("status=sold");

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

describe("mixed content types with different structures", async () => {
  it("handles json by default", async () => {
    const response = await request(app)
      .post("/api/v3/pet/123/mixed-content-types")
      .send({ jsonstatus: "sold" });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      pet: {
        id: 123,
        name: "dog",
        status: "sold",
      },
    });
  });

  it("handles xml", async () => {
    const xmlData = json2xml(JSON.stringify({ xmlstatus: "sold" }), {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    });

    const response = await request(app)
      .post("/api/v3/pet/123/mixed-content-types")
      .set("Content-Type", "application/xml")
      .send(xmlData);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      pet: {
        id: 123,
        name: "dog",
        status: "sold",
      },
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

describe("getPetImage", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .get("/api/v3/pet/123/image")
      .set("Accept", "image/jpeg");

    assert.equal(response.status, 200);
    assert(response.body);
    assert.equal(response.headers["content-type"], "image/jpeg");
  });
});

describe("getPetWebpage", async () => {
  it("returns 200", async () => {
    const response = await request(app)
      .get("/api/v3/pet/123/webpage")
      .set("Accept", "text/html");

    assert.equal(response.status, 200);
    assert.equal(
      response.text,
      "<html><body><h1>Hello, pet 123!</h1></body></html>",
    );
  });
});
