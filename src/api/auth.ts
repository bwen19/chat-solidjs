import { ApiConfig } from "./model";
import { LoginResponse, LoginRequest, RenewTokenResponse, AutoLoginRequest, RenewTokenRequest, LogoutRequest } from "./dto";

export const LoginConfig: ApiConfig<LoginResponse, LoginRequest> = {
  url: "/api/auth/login",
  method: "POST",
};

export const AutoLoginConfig: ApiConfig<LoginResponse, AutoLoginRequest> = {
  url: "/api/auth/auto-login",
  method: "POST",
};

export const RenewTokenConfig: ApiConfig<RenewTokenResponse, RenewTokenRequest> = {
  url: "/api/auth/renew-token",
  method: "POST",
};

export const LogoutConfig: ApiConfig<unknown, LogoutRequest> = {
  url: "/api/auth/logout",
  method: "POST",
};
