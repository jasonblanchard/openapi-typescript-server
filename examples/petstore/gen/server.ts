/**
 * This file was auto-generated by openapi-typescript-server.
 * Do not make direct changes to the file.
 */

import type { paths } from "./schema.d.ts";
import type { Route } from "openapi-typescript-server-runtime";
import { NotImplementedError } from "openapi-typescript-server-runtime";

export interface UpdatePetArgs<Req, Res> {
  parameters: paths['/pet']['put']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
  requestBody: {
    mediaType: "application/json";
    content: paths['/pet']['put']['requestBody']['content']['application/json']
  }
  | {
    mediaType: "application/xml";
    content: paths['/pet']['put']['requestBody']['content']['application/xml']
  }
  | {
    mediaType: "application/x-www-form-urlencoded";
    content: paths['/pet']['put']['requestBody']['content']['application/x-www-form-urlencoded']
  }
  ;
}

interface UpdatePetResult200 {
  content: { 200: paths['/pet']['put']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface UpdatePetResult400 {
  content: { 400: paths['/pet']['put']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface UpdatePetResult404 {
  content: { 404: paths['/pet']['put']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

interface UpdatePetResult405 {
  content: { 405: paths['/pet']['put']['responses']['405']['content'] };
  headers?: { [name: string]: any };
}

export type UpdatePetResult = Promise<UpdatePetResult200 | UpdatePetResult400 | UpdatePetResult404 | UpdatePetResult405>;

export async function updatePetUnimplemented(): UpdatePetResult {
  throw new NotImplementedError()
}

export interface AddPetArgs<Req, Res> {
  parameters: paths['/pet']['post']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
  requestBody: {
    mediaType: "application/json";
    content: paths['/pet']['post']['requestBody']['content']['application/json']
  }
  | {
    mediaType: "application/xml";
    content: paths['/pet']['post']['requestBody']['content']['application/xml']
  }
  | {
    mediaType: "application/x-www-form-urlencoded";
    content: paths['/pet']['post']['requestBody']['content']['application/x-www-form-urlencoded']
  }
  ;
}

interface AddPetResult200 {
  content: { 200: paths['/pet']['post']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface AddPetResult405 {
  content: { 405: paths['/pet']['post']['responses']['405']['content'] };
  headers?: { [name: string]: any };
}

export type AddPetResult = Promise<AddPetResult200 | AddPetResult405>;

export async function addPetUnimplemented(): AddPetResult {
  throw new NotImplementedError()
}

export interface FindPetsByStatusArgs<Req, Res> {
  parameters: paths['/pet/findByStatus']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface FindPetsByStatusResult200 {
  content: { 200: paths['/pet/findByStatus']['get']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface FindPetsByStatusResult400 {
  content: { 400: paths['/pet/findByStatus']['get']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

export type FindPetsByStatusResult = Promise<FindPetsByStatusResult200 | FindPetsByStatusResult400>;

export async function findPetsByStatusUnimplemented(): FindPetsByStatusResult {
  throw new NotImplementedError()
}

export interface FindPetsByTagsArgs<Req, Res> {
  parameters: paths['/pet/findByTags']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface FindPetsByTagsResult200 {
  content: { 200: paths['/pet/findByTags']['get']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface FindPetsByTagsResult400 {
  content: { 400: paths['/pet/findByTags']['get']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

export type FindPetsByTagsResult = Promise<FindPetsByTagsResult200 | FindPetsByTagsResult400>;

export async function findPetsByTagsUnimplemented(): FindPetsByTagsResult {
  throw new NotImplementedError()
}

export interface GetPetByIdArgs<Req, Res> {
  parameters: paths['/pet/{petId}']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface GetPetByIdResult200 {
  content: { 200: paths['/pet/{petId}']['get']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface GetPetByIdResult400 {
  content: { 400: paths['/pet/{petId}']['get']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface GetPetByIdResult404 {
  content: { 404: paths['/pet/{petId}']['get']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type GetPetByIdResult = Promise<GetPetByIdResult200 | GetPetByIdResult400 | GetPetByIdResult404>;

export async function getPetByIdUnimplemented(): GetPetByIdResult {
  throw new NotImplementedError()
}

export interface UpdatePetWithFormArgs<Req, Res> {
  parameters: paths['/pet/{petId}']['post']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface UpdatePetWithFormResult405 {
  content: { 405: paths['/pet/{petId}']['post']['responses']['405']['content'] };
  headers?: { [name: string]: any };
}

export type UpdatePetWithFormResult = Promise<UpdatePetWithFormResult405>;

export async function updatePetWithFormUnimplemented(): UpdatePetWithFormResult {
  throw new NotImplementedError()
}

export interface DeletePetArgs<Req, Res> {
  parameters: paths['/pet/{petId}']['delete']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface DeletePetResult400 {
  content: { 400: paths['/pet/{petId}']['delete']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

export type DeletePetResult = Promise<DeletePetResult400>;

export async function deletePetUnimplemented(): DeletePetResult {
  throw new NotImplementedError()
}

export interface UploadFileArgs<Req, Res> {
  parameters: paths['/pet/{petId}/uploadImage']['post']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
  requestBody: {
    mediaType: "application/octet-stream";
    content?: NonNullable<paths['/pet/{petId}/uploadImage']['post']['requestBody']>['content']['application/octet-stream']
  }
  ;
}

interface UploadFileResult200 {
  content: { 200: paths['/pet/{petId}/uploadImage']['post']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

export type UploadFileResult = Promise<UploadFileResult200>;

export async function uploadFileUnimplemented(): UploadFileResult {
  throw new NotImplementedError()
}

export interface GetInventoryArgs<Req, Res> {
  parameters: paths['/store/inventory']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface GetInventoryResult200 {
  content: { 200: paths['/store/inventory']['get']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

export type GetInventoryResult = Promise<GetInventoryResult200>;

export async function getInventoryUnimplemented(): GetInventoryResult {
  throw new NotImplementedError()
}

export interface PlaceOrderArgs<Req, Res> {
  parameters: paths['/store/order']['post']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
  requestBody: {
    mediaType: "application/json";
    content?: NonNullable<paths['/store/order']['post']['requestBody']>['content']['application/json']
  }
  | {
    mediaType: "application/xml";
    content?: NonNullable<paths['/store/order']['post']['requestBody']>['content']['application/xml']
  }
  | {
    mediaType: "application/x-www-form-urlencoded";
    content?: NonNullable<paths['/store/order']['post']['requestBody']>['content']['application/x-www-form-urlencoded']
  }
  ;
}

interface PlaceOrderResult200 {
  content: { 200: paths['/store/order']['post']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface PlaceOrderResult405 {
  content: { 405: paths['/store/order']['post']['responses']['405']['content'] };
  headers?: { [name: string]: any };
}

export type PlaceOrderResult = Promise<PlaceOrderResult200 | PlaceOrderResult405>;

export async function placeOrderUnimplemented(): PlaceOrderResult {
  throw new NotImplementedError()
}

export interface GetOrderByIdArgs<Req, Res> {
  parameters: paths['/store/order/{orderId}']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface GetOrderByIdResult200 {
  content: { 200: paths['/store/order/{orderId}']['get']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface GetOrderByIdResult400 {
  content: { 400: paths['/store/order/{orderId}']['get']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface GetOrderByIdResult404 {
  content: { 404: paths['/store/order/{orderId}']['get']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type GetOrderByIdResult = Promise<GetOrderByIdResult200 | GetOrderByIdResult400 | GetOrderByIdResult404>;

export async function getOrderByIdUnimplemented(): GetOrderByIdResult {
  throw new NotImplementedError()
}

export interface DeleteOrderArgs<Req, Res> {
  parameters: paths['/store/order/{orderId}']['delete']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface DeleteOrderResult400 {
  content: { 400: paths['/store/order/{orderId}']['delete']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface DeleteOrderResult404 {
  content: { 404: paths['/store/order/{orderId}']['delete']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type DeleteOrderResult = Promise<DeleteOrderResult400 | DeleteOrderResult404>;

export async function deleteOrderUnimplemented(): DeleteOrderResult {
  throw new NotImplementedError()
}

export interface CreateUserArgs<Req, Res> {
  parameters: paths['/user']['post']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
  requestBody: {
    mediaType: "application/json";
    content?: NonNullable<paths['/user']['post']['requestBody']>['content']['application/json']
  }
  | {
    mediaType: "application/xml";
    content?: NonNullable<paths['/user']['post']['requestBody']>['content']['application/xml']
  }
  | {
    mediaType: "application/x-www-form-urlencoded";
    content?: NonNullable<paths['/user']['post']['requestBody']>['content']['application/x-www-form-urlencoded']
  }
  ;
}

interface CreateUserResultDefault {
  content: { default: paths['/user']['post']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type CreateUserResult = Promise<CreateUserResultDefault>;

export async function createUserUnimplemented(): CreateUserResult {
  throw new NotImplementedError()
}

export interface CreateUsersWithListInputArgs<Req, Res> {
  parameters: paths['/user/createWithList']['post']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
  requestBody: {
    mediaType: "application/json";
    content?: NonNullable<paths['/user/createWithList']['post']['requestBody']>['content']['application/json']
  }
  ;
}

interface CreateUsersWithListInputResult200 {
  content: { 200: paths['/user/createWithList']['post']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface CreateUsersWithListInputResultDefault {
  content: { default: paths['/user/createWithList']['post']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type CreateUsersWithListInputResult = Promise<CreateUsersWithListInputResult200 | CreateUsersWithListInputResultDefault>;

export async function createUsersWithListInputUnimplemented(): CreateUsersWithListInputResult {
  throw new NotImplementedError()
}

export interface LoginUserArgs<Req, Res> {
  parameters: paths['/user/login']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface LoginUserResult200 {
  content: { 200: paths['/user/login']['get']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface LoginUserResult400 {
  content: { 400: paths['/user/login']['get']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

export type LoginUserResult = Promise<LoginUserResult200 | LoginUserResult400>;

export async function loginUserUnimplemented(): LoginUserResult {
  throw new NotImplementedError()
}

export interface LogoutUserArgs<Req, Res> {
  parameters: paths['/user/logout']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface LogoutUserResultDefault {
  content: { default: paths['/user/logout']['get']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type LogoutUserResult = Promise<LogoutUserResultDefault>;

export async function logoutUserUnimplemented(): LogoutUserResult {
  throw new NotImplementedError()
}

export interface GetUserByNameArgs<Req, Res> {
  parameters: paths['/user/{username}']['get']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface GetUserByNameResult200 {
  content: { 200: paths['/user/{username}']['get']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface GetUserByNameResult400 {
  content: { 400: paths['/user/{username}']['get']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface GetUserByNameResult404 {
  content: { 404: paths['/user/{username}']['get']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type GetUserByNameResult = Promise<GetUserByNameResult200 | GetUserByNameResult400 | GetUserByNameResult404>;

export async function getUserByNameUnimplemented(): GetUserByNameResult {
  throw new NotImplementedError()
}

export interface UpdateUserArgs<Req, Res> {
  parameters: paths['/user/{username}']['put']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
  requestBody: {
    mediaType: "application/json";
    content?: NonNullable<paths['/user/{username}']['put']['requestBody']>['content']['application/json']
  }
  | {
    mediaType: "application/xml";
    content?: NonNullable<paths['/user/{username}']['put']['requestBody']>['content']['application/xml']
  }
  | {
    mediaType: "application/x-www-form-urlencoded";
    content?: NonNullable<paths['/user/{username}']['put']['requestBody']>['content']['application/x-www-form-urlencoded']
  }
  ;
}

interface UpdateUserResultDefault {
  content: { default: paths['/user/{username}']['put']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type UpdateUserResult = Promise<UpdateUserResultDefault>;

export async function updateUserUnimplemented(): UpdateUserResult {
  throw new NotImplementedError()
}

export interface DeleteUserArgs<Req, Res> {
  parameters: paths['/user/{username}']['delete']['parameters'];
  contentType: string;
  req: Req;
  res: Res;
}

interface DeleteUserResult400 {
  content: { 400: paths['/user/{username}']['delete']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface DeleteUserResult404 {
  content: { 404: paths['/user/{username}']['delete']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type DeleteUserResult = Promise<DeleteUserResult400 | DeleteUserResult404>;

export async function deleteUserUnimplemented(): DeleteUserResult {
  throw new NotImplementedError()
}

export interface Server<Req = unknown, Res = unknown> {
  updatePet: (
    args: UpdatePetArgs<Req, Res>
  ) => UpdatePetResult;
  addPet: (
    args: AddPetArgs<Req, Res>
  ) => AddPetResult;
  findPetsByStatus: (
    args: FindPetsByStatusArgs<Req, Res>
  ) => FindPetsByStatusResult;
  findPetsByTags: (
    args: FindPetsByTagsArgs<Req, Res>
  ) => FindPetsByTagsResult;
  getPetById: (
    args: GetPetByIdArgs<Req, Res>
  ) => GetPetByIdResult;
  updatePetWithForm: (
    args: UpdatePetWithFormArgs<Req, Res>
  ) => UpdatePetWithFormResult;
  deletePet: (
    args: DeletePetArgs<Req, Res>
  ) => DeletePetResult;
  uploadFile: (
    args: UploadFileArgs<Req, Res>
  ) => UploadFileResult;
  getInventory: (
    args: GetInventoryArgs<Req, Res>
  ) => GetInventoryResult;
  placeOrder: (
    args: PlaceOrderArgs<Req, Res>
  ) => PlaceOrderResult;
  getOrderById: (
    args: GetOrderByIdArgs<Req, Res>
  ) => GetOrderByIdResult;
  deleteOrder: (
    args: DeleteOrderArgs<Req, Res>
  ) => DeleteOrderResult;
  createUser: (
    args: CreateUserArgs<Req, Res>
  ) => CreateUserResult;
  createUsersWithListInput: (
    args: CreateUsersWithListInputArgs<Req, Res>
  ) => CreateUsersWithListInputResult;
  loginUser: (
    args: LoginUserArgs<Req, Res>
  ) => LoginUserResult;
  logoutUser: (
    args: LogoutUserArgs<Req, Res>
  ) => LogoutUserResult;
  getUserByName: (
    args: GetUserByNameArgs<Req, Res>
  ) => GetUserByNameResult;
  updateUser: (
    args: UpdateUserArgs<Req, Res>
  ) => UpdateUserResult;
  deleteUser: (
    args: DeleteUserArgs<Req, Res>
  ) => DeleteUserResult;
}

export function registerRouteHandlers<Req, Res>(server: Server<Req, Res>): Route[] {
  return [
    {
      method: "put",
      path: "/pet",
      handler: server.updatePet,
    },
    {
      method: "post",
      path: "/pet",
      handler: server.addPet,
    },
    {
      method: "get",
      path: "/pet/findByStatus",
      handler: server.findPetsByStatus,
    },
    {
      method: "get",
      path: "/pet/findByTags",
      handler: server.findPetsByTags,
    },
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
    {
      method: "delete",
      path: "/pet/{petId}",
      handler: server.deletePet,
    },
    {
      method: "post",
      path: "/pet/{petId}/uploadImage",
      handler: server.uploadFile,
    },
    {
      method: "get",
      path: "/store/inventory",
      handler: server.getInventory,
    },
    {
      method: "post",
      path: "/store/order",
      handler: server.placeOrder,
    },
    {
      method: "get",
      path: "/store/order/{orderId}",
      handler: server.getOrderById,
    },
    {
      method: "delete",
      path: "/store/order/{orderId}",
      handler: server.deleteOrder,
    },
    {
      method: "post",
      path: "/user",
      handler: server.createUser,
    },
    {
      method: "post",
      path: "/user/createWithList",
      handler: server.createUsersWithListInput,
    },
    {
      method: "get",
      path: "/user/login",
      handler: server.loginUser,
    },
    {
      method: "get",
      path: "/user/logout",
      handler: server.logoutUser,
    },
    {
      method: "get",
      path: "/user/{username}",
      handler: server.getUserByName,
    },
    {
      method: "put",
      path: "/user/{username}",
      handler: server.updateUser,
    },
    {
      method: "delete",
      path: "/user/{username}",
      handler: server.deleteUser,
    },
  ]
}
