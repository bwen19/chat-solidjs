import { ApiConfig } from "./model";
import { LoginResponse, LoginRequest, AutoLoginRequest, RenewTokenResponse } from "./dto";

export const LoginConfig: ApiConfig<LoginResponse, LoginRequest> = {
  url: "/api/auth/login",
  method: "POST",
};

export const AutoLoginConfig: ApiConfig<LoginResponse, AutoLoginRequest> = {
  url: "/api/auth/auto-login",
  method: "POST",
};

export const RenewTokenConfig: ApiConfig<RenewTokenResponse, unknown> = {
  url: "/api/auth/renew-token",
  method: "POST",
};

export const LogoutConfig: ApiConfig<unknown, unknown> = {
  url: "/api/auth/logout",
  method: "POST",
};
