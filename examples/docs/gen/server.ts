/**
 * This file was auto-generated by openapi-typescript-server@0.0.7.
 * Do not make direct changes to the file.
 */

import type { paths } from "./schema.d.ts";
import type { Route } from "openapi-typescript-server-runtime";
import { NotImplementedError } from "openapi-typescript-server-runtime";

export interface MakePetSpeakArgs<Req, Res> {
  parameters: paths['/speak/{petId}']['post']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
  requestBody: {
    mediaType: "application/json";
    content: paths['/speak/{petId}']['post']['requestBody']['content']['application/json']
  }
  ;
}

interface MakePetSpeakResult200 {
  content: { 200: paths['/speak/{petId}']['post']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

export type MakePetSpeakResult = Promise<MakePetSpeakResult200>;

export async function makePetSpeakUnimplemented(): MakePetSpeakResult {
  throw new NotImplementedError()
}

export interface UhohArgs<Req, Res> {
  parameters: paths['/uhoh']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface UhohResultDefault {
  content: { default: paths['/uhoh']['get']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type UhohResult = Promise<UhohResultDefault>;

export async function uhohUnimplemented(): UhohResult {
  throw new NotImplementedError()
}

export interface Server<Req = unknown, Res = unknown> {
  makePetSpeak: (
    args: MakePetSpeakArgs<Req, Res>
  ) => MakePetSpeakResult;
  uhoh: (
    args: UhohArgs<Req, Res>
  ) => UhohResult;
}

export function registerRouteHandlers<Req, Res>(server: Server<Req, Res>): Route[] {
  return [
    {
      method: "post",
      path: "/speak/{petId}",
      handler: server.makePetSpeak as Route["handler"],
    },
    {
      method: "get",
      path: "/uhoh",
      handler: server.uhoh as Route["handler"],
    },
  ]
}
