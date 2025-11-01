import type * as ServerTypes from "./gen/server.ts";
import type { Request, Response } from "express";

// Service implementation for "pets" tag
export const petsService: ServerTypes.ServerForPets<Request, Response> = {
  listPets: async (): ServerTypes.ListPetsResult => {
    return {
      content: {
        200: {
          "application/json": {
            pets: [
              { id: 1, name: "dog" },
              { id: 2, name: "cat" },
            ],
          },
        },
      },
    };
  },

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
    const { status } = requestBody.content;

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
};

// Service implementation for "store" tag
export const storeService: ServerTypes.ServerForStore<Request, Response> = {
  getInventory: async (): ServerTypes.GetInventoryResult => {
    return {
      content: {
        200: {
          "application/json": {
            inventory: {
              available: 10,
              pending: 5,
              sold: 3,
            },
          },
        },
      },
    };
  },

  placeOrder: async ({ requestBody }): ServerTypes.PlaceOrderResult => {
    const { petId, quantity } = requestBody.content;

    return {
      content: {
        200: {
          "application/json": {
            order: {
              id: Math.floor(Math.random() * 1000),
              petId,
              quantity,
              status: "placed",
            },
          },
        },
      },
    };
  },
};

// Service implementation for untagged operations
export const untaggedService: ServerTypes.ServerForUntagged<Request, Response> =
  {
    listUsers: async (): ServerTypes.ListUsersResult => {
      return {
        content: {
          200: {
            "application/json": {
              users: [
                { id: 1, username: "john_doe", email: "john@example.com" },
                { id: 2, username: "jane_smith", email: "jane@example.com" },
              ],
            },
          },
        },
      };
    },
  };
