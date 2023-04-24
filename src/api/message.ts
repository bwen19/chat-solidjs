import { ApiConfig, FriendInfo, RoomInfo } from ".";

export type MessageInfo = {
  id: number;
  sid: number;
  name: string;
  avatar: string;
  content: string;
  kind: string;
  divide: boolean;
  send_at: string;
};

// ---------------- Initialize ---------------- //
export type InitialRequest = {
  Initialize: {
    timestamp: number;
  };
};
export type InitialResponse = {
  rooms: RoomInfo[];
  friends: FriendInfo[];
};

// ---------------- SendMessage ---------------- //
export type NewMessageRequest = {
  SendMessage: {
    room_id: number;
    content: string;
    kind: string;
  };
};
export type NewMessageResponse = {
  room_id: number;
  message: MessageInfo;
};

// ---------------- SendFile ---------------- //
export type SendFileResponse = {
  file_url: string;
};
export const SendFileConfig: ApiConfig<SendFileResponse> = {
  url: "/api/message/file",
  method: "POST",
};
