/**
 * This file was auto-generated by openapi-typescript-server.
 * Do not make direct changes to the file.
 */

import type { operations } from "./schema.d.ts";
import type { Route } from "openapi-typescript-server/route";

export interface UpdatePetArgs<Req, Res> {
  parameters: operations['updatePet']['parameters'];
  requestBody: operations['updatePet']['requestBody'];
  req: Req;
  res: Res;
}

interface UpdatePetResult_200 {
  content: { 200: operations['updatePet']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface UpdatePetResult_400 {
  content: { 400: operations['updatePet']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface UpdatePetResult_404 {
  content: { 404: operations['updatePet']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

interface UpdatePetResult_405 {
  content: { 405: operations['updatePet']['responses']['405']['content'] };
  headers?: { [name: string]: any };
}

export type UpdatePetResult = Promise<UpdatePetResult_200 | UpdatePetResult_400 | UpdatePetResult_404 | UpdatePetResult_405>;

export interface AddPetArgs<Req, Res> {
  parameters: operations['addPet']['parameters'];
  requestBody: operations['addPet']['requestBody'];
  req: Req;
  res: Res;
}

interface AddPetResult_200 {
  content: { 200: operations['addPet']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface AddPetResult_405 {
  content: { 405: operations['addPet']['responses']['405']['content'] };
  headers?: { [name: string]: any };
}

export type AddPetResult = Promise<AddPetResult_200 | AddPetResult_405>;

export interface FindPetsByStatusArgs<Req, Res> {
  parameters: operations['findPetsByStatus']['parameters'];
  requestBody: operations['findPetsByStatus']['requestBody'];
  req: Req;
  res: Res;
}

interface FindPetsByStatusResult_200 {
  content: { 200: operations['findPetsByStatus']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface FindPetsByStatusResult_400 {
  content: { 400: operations['findPetsByStatus']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

export type FindPetsByStatusResult = Promise<FindPetsByStatusResult_200 | FindPetsByStatusResult_400>;

export interface FindPetsByTagsArgs<Req, Res> {
  parameters: operations['findPetsByTags']['parameters'];
  requestBody: operations['findPetsByTags']['requestBody'];
  req: Req;
  res: Res;
}

interface FindPetsByTagsResult_200 {
  content: { 200: operations['findPetsByTags']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface FindPetsByTagsResult_400 {
  content: { 400: operations['findPetsByTags']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

export type FindPetsByTagsResult = Promise<FindPetsByTagsResult_200 | FindPetsByTagsResult_400>;

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

interface GetPetByIdResult_400 {
  content: { 400: operations['getPetById']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface GetPetByIdResult_404 {
  content: { 404: operations['getPetById']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type GetPetByIdResult = Promise<GetPetByIdResult_200 | GetPetByIdResult_400 | GetPetByIdResult_404>;

export interface UpdatePetWithFormArgs<Req, Res> {
  parameters: operations['updatePetWithForm']['parameters'];
  requestBody: operations['updatePetWithForm']['requestBody'];
  req: Req;
  res: Res;
}

interface UpdatePetWithFormResult_405 {
  content: { 405: operations['updatePetWithForm']['responses']['405']['content'] };
  headers?: { [name: string]: any };
}

export type UpdatePetWithFormResult = Promise<UpdatePetWithFormResult_405>;

export interface DeletePetArgs<Req, Res> {
  parameters: operations['deletePet']['parameters'];
  requestBody: operations['deletePet']['requestBody'];
  req: Req;
  res: Res;
}

interface DeletePetResult_400 {
  content: { 400: operations['deletePet']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

export type DeletePetResult = Promise<DeletePetResult_400>;

export interface UploadFileArgs<Req, Res> {
  parameters: operations['uploadFile']['parameters'];
  requestBody: operations['uploadFile']['requestBody'];
  req: Req;
  res: Res;
}

interface UploadFileResult_200 {
  content: { 200: operations['uploadFile']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

export type UploadFileResult = Promise<UploadFileResult_200>;

export interface GetInventoryArgs<Req, Res> {
  parameters: operations['getInventory']['parameters'];
  requestBody: operations['getInventory']['requestBody'];
  req: Req;
  res: Res;
}

interface GetInventoryResult_200 {
  content: { 200: operations['getInventory']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

export type GetInventoryResult = Promise<GetInventoryResult_200>;

export interface PlaceOrderArgs<Req, Res> {
  parameters: operations['placeOrder']['parameters'];
  requestBody: operations['placeOrder']['requestBody'];
  req: Req;
  res: Res;
}

interface PlaceOrderResult_200 {
  content: { 200: operations['placeOrder']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface PlaceOrderResult_405 {
  content: { 405: operations['placeOrder']['responses']['405']['content'] };
  headers?: { [name: string]: any };
}

export type PlaceOrderResult = Promise<PlaceOrderResult_200 | PlaceOrderResult_405>;

export interface GetOrderByIdArgs<Req, Res> {
  parameters: operations['getOrderById']['parameters'];
  requestBody: operations['getOrderById']['requestBody'];
  req: Req;
  res: Res;
}

interface GetOrderByIdResult_200 {
  content: { 200: operations['getOrderById']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface GetOrderByIdResult_400 {
  content: { 400: operations['getOrderById']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface GetOrderByIdResult_404 {
  content: { 404: operations['getOrderById']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type GetOrderByIdResult = Promise<GetOrderByIdResult_200 | GetOrderByIdResult_400 | GetOrderByIdResult_404>;

export interface DeleteOrderArgs<Req, Res> {
  parameters: operations['deleteOrder']['parameters'];
  requestBody: operations['deleteOrder']['requestBody'];
  req: Req;
  res: Res;
}

interface DeleteOrderResult_400 {
  content: { 400: operations['deleteOrder']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface DeleteOrderResult_404 {
  content: { 404: operations['deleteOrder']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type DeleteOrderResult = Promise<DeleteOrderResult_400 | DeleteOrderResult_404>;

export interface CreateUserArgs<Req, Res> {
  parameters: operations['createUser']['parameters'];
  requestBody: operations['createUser']['requestBody'];
  req: Req;
  res: Res;
}

interface CreateUserResult_default {
  content: { default: operations['createUser']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type CreateUserResult = Promise<CreateUserResult_default>;

export interface CreateUsersWithListInputArgs<Req, Res> {
  parameters: operations['createUsersWithListInput']['parameters'];
  requestBody: operations['createUsersWithListInput']['requestBody'];
  req: Req;
  res: Res;
}

interface CreateUsersWithListInputResult_200 {
  content: { 200: operations['createUsersWithListInput']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface CreateUsersWithListInputResult_default {
  content: { default: operations['createUsersWithListInput']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type CreateUsersWithListInputResult = Promise<CreateUsersWithListInputResult_200 | CreateUsersWithListInputResult_default>;

export interface LoginUserArgs<Req, Res> {
  parameters: operations['loginUser']['parameters'];
  requestBody: operations['loginUser']['requestBody'];
  req: Req;
  res: Res;
}

interface LoginUserResult_200 {
  content: { 200: operations['loginUser']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface LoginUserResult_400 {
  content: { 400: operations['loginUser']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

export type LoginUserResult = Promise<LoginUserResult_200 | LoginUserResult_400>;

export interface LogoutUserArgs<Req, Res> {
  parameters: operations['logoutUser']['parameters'];
  requestBody: operations['logoutUser']['requestBody'];
  req: Req;
  res: Res;
}

interface LogoutUserResult_default {
  content: { default: operations['logoutUser']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type LogoutUserResult = Promise<LogoutUserResult_default>;

export interface GetUserByNameArgs<Req, Res> {
  parameters: operations['getUserByName']['parameters'];
  requestBody: operations['getUserByName']['requestBody'];
  req: Req;
  res: Res;
}

interface GetUserByNameResult_200 {
  content: { 200: operations['getUserByName']['responses']['200']['content'] };
  headers?: { [name: string]: any };
}

interface GetUserByNameResult_400 {
  content: { 400: operations['getUserByName']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface GetUserByNameResult_404 {
  content: { 404: operations['getUserByName']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type GetUserByNameResult = Promise<GetUserByNameResult_200 | GetUserByNameResult_400 | GetUserByNameResult_404>;

export interface UpdateUserArgs<Req, Res> {
  parameters: operations['updateUser']['parameters'];
  requestBody: operations['updateUser']['requestBody'];
  req: Req;
  res: Res;
}

interface UpdateUserResult_default {
  content: { default: operations['updateUser']['responses']['default']['content'] };
  headers?: { [name: string]: any };
  status: number;
}

export type UpdateUserResult = Promise<UpdateUserResult_default>;

export interface DeleteUserArgs<Req, Res> {
  parameters: operations['deleteUser']['parameters'];
  requestBody: operations['deleteUser']['requestBody'];
  req: Req;
  res: Res;
}

interface DeleteUserResult_400 {
  content: { 400: operations['deleteUser']['responses']['400']['content'] };
  headers?: { [name: string]: any };
}

interface DeleteUserResult_404 {
  content: { 404: operations['deleteUser']['responses']['404']['content'] };
  headers?: { [name: string]: any };
}

export type DeleteUserResult = Promise<DeleteUserResult_400 | DeleteUserResult_404>;

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

export function registerServerHandlers(server: Server): Route[] {
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
