import { ApiConfig } from "./model";
import { HubStatusResponse, SendFileResponse } from "./dto";

export const SendFileConfig: ApiConfig<SendFileResponse> = {
  url: "/api/message/file",
  method: "POST",
};

export const ChangeCoverConfig: ApiConfig<unknown, number> = {
  url: "/api/room/cover",
  method: "POST",
  path: true,
};

export const HubStatusConfig: ApiConfig<HubStatusResponse> = {
  url: "/api/room/status",
  method: "GET",
};
