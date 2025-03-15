import type * as ServerTypes from "./gen/server.ts";
import * as server from "./gen/server.ts";
import type { Request, Response } from "express";

const API: ServerTypes.Server<Request, Response> = {
  getPetById: async ({ parameters }): ServerTypes.GetPetByIdResult => {
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

    if (parameters.path.petId === 500) {
      throw new Error("Cannot get that pet");
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

  updatePetWithForm: async ({
    parameters,
    requestBody,
  }): ServerTypes.UpdatePetWithFormResult => {
    const { petId } = parameters.path;
    const { name } = parameters.query ?? {};
    const { status } = requestBody.content["application/json"];

    return {
      content: {
        200: {
          "application/json": {
            pet: { id: petId, name: name || "dog", status },
          },
        },
      },
    };
  },

  listPets: server.listPets_unimplemented,
};

export default API;
