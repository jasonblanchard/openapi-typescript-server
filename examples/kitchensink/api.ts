import type * as ServerTypes from "./gen/server.ts";
import * as server from "./gen/server.ts";
import type { Request, Response } from "express";
import { promises as fs } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const API: ServerTypes.Server<Request, Response> = {
  getPetById: async ({ parameters, req }): ServerTypes.GetPetByIdResult => {
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

  mixedContentTypes: async ({
    parameters,
    requestBody,
    contentType,
  }): ServerTypes.MixedContentTypesResult => {
    const { petId } = parameters.path;
    let status: "available" | "pending" | "sold" | undefined;

    // Since each content type has different structures,
    // use the request content type and requestBody discriminator to narrow the type in each case.

    if (
      contentType === "application/json" &&
      requestBody.mediaType === "application/json"
    ) {
      status = requestBody.content.jsonstatus;
    }

    if (
      contentType == "application/xml" &&
      requestBody.mediaType === "application/xml"
    ) {
      status = requestBody.content.xmlstatus;
    }

    return {
      content: {
        200: {
          "application/json": {
            pet: { id: petId, name: "dog", status },
          },
        },
      },
    };
  },

  listPets: server.listPetsUnimplemented,

  listPetsBySize: server.listPetsBySizeUnimplemented,

  getPetImage: async (): ServerTypes.GetPetImageResult => {
    const image = await fs.readFile(join(__dirname, `./cat.jpeg`), {
      encoding: "base64",
    });

    return {
      content: {
        200: {
          "image/jpeg": image,
        },
      },
    };
  },

  getPetWebpage: async ({ parameters }): ServerTypes.GetPetWebpageResult => {
    const { petId } = parameters.path;
    return {
      content: {
        200: {
          "text/html": `<html><body><h1>Hello, pet ${petId}!</h1></body></html>`,
        },
      },
    };
  },
};

export default API;
