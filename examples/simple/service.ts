import type { Server } from "./gen/server.ts";

const Service: Server = {
  getPetById: async () => {
    return {
      responseType: "200",
      content: { "application/json": { pet: { id: 1, name: "dog" } } },
    };
  },

  updatePetWithForm: async () => {
    return {
      responseType: "200",
      content: { "application/json": { pet: { id: 1, name: "dog" } } },
    };
  },
};

export default Service;
