import { ApiConfig, UserInfo } from ".";

// ---------------- Register ---------------- //
export type RegisterRequest = {
  username: string;
  password: string;
  code: string;
};
export type RegisterResponse = {
  user: UserInfo;
};
export const RegisterConfig: ApiConfig<RegisterResponse, RegisterRequest> = {
  url: "/api/auth/register",
  method: "POST",
};

// ---------------- Login ---------------- //
export type LoginRequest = {
  username: string;
  password: string;
  is_admin?: boolean;
  is_persisted?: boolean;
};
export type LoginResponse = {
  user: UserInfo;
  access_token: string;
};
export const LoginConfig: ApiConfig<LoginResponse, LoginRequest> = {
  url: "/api/auth/login",
  method: "POST",
};

// ---------------- AutoLogin ---------------- //
export type AutoLoginRequest = {
  is_admin?: boolean;
};
export const AutoLoginConfig: ApiConfig<LoginResponse, AutoLoginRequest> = {
  url: "/api/auth/auto-login",
  method: "POST",
};

// ---------------- RenewToken ---------------- //
export type RenewTokenResponse = {
  access_token: string;
};
export const RenewTokenConfig: ApiConfig<RenewTokenResponse> = {
  url: "/api/auth/renew-token",
  method: "POST",
};

// ---------------- Logout ---------------- //
export const LogoutConfig: ApiConfig = {
  url: "/api/auth/logout",
  method: "POST",
};
