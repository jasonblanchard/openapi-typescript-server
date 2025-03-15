import { describe, it } from "node:test";
import assert from "node:assert";
import { NotImplementedError } from "./errors.ts";

describe("errors", () => {
  it("should be able to detect type of error", () => {
    const err = new NotImplementedError();
    assert(err instanceof NotImplementedError);
  });
});
