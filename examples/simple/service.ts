import type {
  Server,
  GetPetByIdResult,
  UpdatePetWithFormResult,
} from "./gen/server.ts";

const Service: Server = {
  getPetById: async ({ parameters }): GetPetByIdResult => {
    if (parameters.path.petId === 42) {
      return {
        responseVariant: "default",
        content: {
          "application/json": {
            message: "Pet not found",
          },
        },
        status: 404,
      };
    }

    return {
      responseVariant: "200",
      content: { "application/json": { pet: { id: 1, name: "dog" } } },
    };
  },

  updatePetWithForm: async (): UpdatePetWithFormResult => {
    return {
      responseVariant: "200",
      content: { "application/json": { pet: { id: 1, name: "dog" } } },
    };
  },
};

export default Service;
