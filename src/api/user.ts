import { ApiConfig } from ".";

export type UserInfo = {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  role: string;
  deleted: boolean;
  create_at: string;
};

// ---------------- CreateUser ---------------- //
export type CreateUserRequest = {
  username: string;
  password: string;
  role: string;
};
export type CreateUserResponse = {
  user: UserInfo;
};
export const CreateUserConfig: ApiConfig<CreateUserResponse, CreateUserRequest> = {
  url: "/api/user",
  method: "POST",
};

// ---------------- DeleteUsers ---------------- //
export type DeleteUsersRequest = {
  user_ids: number[];
};
export const DeleteUsersConfig: ApiConfig<{}, DeleteUsersRequest> = {
  url: "/api/user",
  method: "DELETE",
};

// ---------------- UpdateUser ---------------- //
export type UpdateUserRequest = {
  user_id: number;
  username?: string;
  password?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  role?: string;
  deleted?: boolean;
};
export type UpdateUserResponse = {
  user: UserInfo;
};
export const UpdateUserConfig: ApiConfig<UpdateUserResponse, UpdateUserRequest> = {
  url: "/api/user",
  method: "PATCH",
};

// ---------------- ChangeAvatar ---------------- //

export type ChangeAvatarResponse = {
  avatar: string;
};
export const ChangeAvatarConfig: ApiConfig<ChangeAvatarResponse> = {
  url: "/api/user/avatar",
  method: "POST",
};

// ---------------- ChangePasswor ---------------- //
export type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
};
export const ChangePasswordConfig: ApiConfig<{}, ChangePasswordRequest> = {
  url: "/api/user/password",
  method: "PATCH",
};

// ---------------- ListUsers ---------------- //
export type ListUsersRequest = {
  page_id?: number;
  page_size?: number;
  keyword?: string;
};
export type ListUsersResponse = {
  total: number;
  users: UserInfo[];
};
export const ListUsersConfig: ApiConfig<ListUsersResponse, ListUsersRequest> = {
  url: "/api/user",
  method: "GET",
};

// ---------------- GetUserByName ---------------- //
export type GetUserByNameRequest = {
  username: string;
};
export type GetUserByNameResponse = {
  user?: UserInfo;
};
export const GetUserByNameConfig: ApiConfig<GetUserByNameResponse, GetUserByNameRequest> = {
  url: "/api/user/username",
  method: "GET",
};
