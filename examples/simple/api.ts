import type {
  Server,
  GetPetByIdResult,
  UpdatePetWithFormResult,
} from "./gen/server.ts";
import type { Request, Response } from "express";

const API: Server<Request, Response> = {
  getPetById: async ({ parameters }): GetPetByIdResult => {
    if (parameters.path.petId === 42) {
      return {
        content: {
          default: {
            "application/json": {
              message: "Cannot get that pet",
            },
          },
        },
        status: 503,
      };
    }

    return {
      content: {
        200: {
          "application/json": {
            pet: { id: parameters.path.petId, name: "dog" },
          },
        },
      },
    };
  },

  updatePetWithForm: async (): UpdatePetWithFormResult => {
    return {
      content: { 200: { "application/json": { pet: { id: 1, name: "dog" } } } },
    };
  },
};

export default API;
