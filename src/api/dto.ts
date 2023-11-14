import { UserInfo } from "./model";

// ============================== // Auth // ============================== //

export type LoginRequest = {
  username: string;
  password: string;
  is_admin: boolean;
};

export type LoginResponse = {
  user: UserInfo;
  access_token: string;
};

export type AutoLoginRequest = {
  is_admin: boolean;
};

export type RenewTokenResponse = {
  access_token: string;
};

// ============================== // User // ============================== //

export type CreateUserRequest = {
  username: string;
  password: string;
  role: string;
};

export type CreateUserResponse = {
  user: UserInfo;
};

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

export type ChangeAvatarResponse = {
  avatar: string;
};

export type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
};

export type ListUsersRequest = {
  page_id?: number;
  page_size?: number;
  keyword?: string;
};

export type ListUsersResponse = {
  total: number;
  users: UserInfo[];
};

export type FindUserResponse = {
  user?: UserInfo;
};

export type SendFileResponse = {
  file_url: string;
};
