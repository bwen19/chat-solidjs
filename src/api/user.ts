import { ApiConfig } from "./model";
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserResponse,
  UpdateUserRequest,
  ChangeAvatarResponse,
  ChangePasswordRequest,
  ListUsersResponse,
  ListUsersRequest,
  FindUserResponse,
  SendFileResponse,
} from "./dto";

export const CreateUserConfig: ApiConfig<CreateUserResponse, CreateUserRequest> = {
  url: "/api/user",
  method: "POST",
};

export const DeleteUserConfig: ApiConfig<unknown, number> = {
  url: "/api/user",
  method: "DELETE",
  path: true,
};

export const UpdateUserConfig: ApiConfig<UpdateUserResponse, UpdateUserRequest> = {
  url: "/api/user",
  method: "PATCH",
};

export const ChangeAvatarConfig: ApiConfig<ChangeAvatarResponse> = {
  url: "/api/user/avatar",
  method: "POST",
};

export const ChangePasswordConfig: ApiConfig<unknown, ChangePasswordRequest> = {
  url: "/api/user/password",
  method: "PATCH",
};

export const ListUsersConfig: ApiConfig<ListUsersResponse, ListUsersRequest> = {
  url: "/api/user",
  method: "GET",
};

export const FindUserConfig: ApiConfig<FindUserResponse, string> = {
  url: "/api/user/name",
  method: "GET",
  path: true,
};

export const SendFileConfig: ApiConfig<SendFileResponse> = {
  url: "/api/message/file",
  method: "POST",
};
