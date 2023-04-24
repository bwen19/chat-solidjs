export * from "./auth";
export * from "./friend";
export * from "./member";
export * from "./message";
export * from "./room";
export * from "./user";

export interface ApiConfig<T extends unknown = unknown, P extends unknown = unknown> {
  url: string;
  method: string;
  responseData?: T;
  requestData?: P;
}
