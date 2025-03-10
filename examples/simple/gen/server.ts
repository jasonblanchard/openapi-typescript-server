/**
 * This file was auto-generated by openapi-typescript-server.
 * Do not make direct changes to the file.
 */

import type { operations } from "./schema.d.ts";
import type { Route } from "openapi-typescript-server/route";

export interface GetPetByIdArgs<Req, Res> {
  parameters: operations['getPetById']['parameters'];
  requestBody: operations['getPetById']['requestBody'];
  req: Req;
  res: Res;
}

interface GetPetByIdResult_200 {
  content: { 200: operations['getPetById']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface GetPetByIdResult_default {
  content: { default: operations['getPetById']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type GetPetByIdResult = Promise<GetPetByIdResult_200 | GetPetByIdResult_default>;

export interface UpdatePetWithFormArgs<Req, Res> {
  parameters: operations['updatePetWithForm']['parameters'];
  requestBody: operations['updatePetWithForm']['requestBody'];
  req: Req;
  res: Res;
}

interface UpdatePetWithFormResult_200 {
  content: { 200: operations['updatePetWithForm']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface UpdatePetWithFormResult_default {
  content: { default: operations['updatePetWithForm']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type UpdatePetWithFormResult = Promise<UpdatePetWithFormResult_200 | UpdatePetWithFormResult_default>;

export interface Server<Req = unknown, Res = unknown> {
  getPetById: (
    args: GetPetByIdArgs<Req, Res>
  ) => GetPetByIdResult;
  updatePetWithForm: (
    args: UpdatePetWithFormArgs<Req, Res>
  ) => UpdatePetWithFormResult;
}

export function registerRouteHandlers(server: Server): Route[] {
  return [
    {
      method: "get",
      path: "/pet/{petId}",
      handler: server.getPetById,
    },
    {
      method: "post",
      path: "/pet/{petId}",
      handler: server.updatePetWithForm,
    },
  ]
}
