import type * as ServerTypes from "./gen/server.ts";
import type { Request, Response } from "express";

// Explicitly specifying the type rather than relying on structural typing, gives you type inference for handler arguments and faster feedback in the definition vs at the call site.
const API: ServerTypes.Server<Request, Response> = {
  makePetSpeak: async ({ parameters, requestBody }) => {
    const petId = parameters.path.petId;
    const sound = requestBody.content.sound;

    return {
      content: {
        200: {
          "application/json": {
            greeting: `Pet ${petId} says "${sound}"`,
          },
        },
      },
    };
  },

  uhoh: async () => {
    return {
      content: {
        default: {
          "application/json": {
            message: "This is what it looks like when something goes wrong",
          },
        },
      },
      status: 418,
    };
  },
};

export default API;
