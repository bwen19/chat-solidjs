import { FriendInfo, MemberInfo, RoomInfo, MessageInfo } from "./model";

export type InitializeRequest = {
  // end_time: Date;
  timestamp: number;
};
export type InitializeResponse = {
  rooms: RoomInfo[];
  friends: FriendInfo[];
};

export type NewMessageRequest = {
  room_id: number;
  content: string;
  kind: string;
};
export type NewMessageResponse = {
  message: MessageInfo;
};

export type AddFriendRequest = {
  friend_id: number;
};
export type AddFriendResponse = {
  friend: FriendInfo;
};

export type AcceptFriendRequest = {
  friend_id: number;
};
export type AcceptFriendResponse = {
  friend: FriendInfo;
  room: RoomInfo;
};

export type RefuseFriendRequest = {
  friend_id: number;
};
export type RefuseFriendResponse = {
  friend_id: number;
};

export type DeleteFriendRequest = {
  friend_id: number;
};
export type DeleteFriendResponse = {
  friend_id: number;
  room_id: number;
};

export type NewRoomRequest = {
  name: string;
  members_id: number[];
};
export type NewRoomResponse = {
  room: RoomInfo;
};

export type UpdateRoomResquest = {
  room_id: number;
  name: string;
};
export type UpdateRoomResponse = {
  room_id: number;
  name: string;
};

export type DeleteRoomRequest = {
  room_id: number;
};
export type DeleteRoomResponse = {
  room_id: number;
};

export type LeaveRoomRequest = {
  room_id: number;
};

export type AddMembersRequest = {
  room_id: number;
  members_id: number[];
};
export type AddMembersResponse = {
  room_id: number;
  members: MemberInfo[];
};

export type DeleteMembersRequest = {
  room_id: number;
  members_id: number[];
};
export type DeleteMembersResponse = {
  room_id: number;
  members_id: number[];
};

// ---------------- WebsocketEvent ---------------- //

export type EventData =
  | string
  | InitializeRequest
  | InitializeResponse
  | NewMessageRequest
  | NewMessageResponse
  | AddFriendRequest
  | AddFriendResponse
  | AcceptFriendRequest
  | AcceptFriendResponse
  | RefuseFriendRequest
  | RefuseFriendResponse
  | DeleteFriendRequest
  | DeleteFriendResponse
  | NewRoomRequest
  | NewRoomResponse
  | UpdateRoomResquest
  | UpdateRoomResponse
  | DeleteRoomRequest
  | DeleteRoomResponse
  | LeaveRoomRequest
  | AddMembersRequest
  | AddMembersResponse
  | DeleteMembersRequest
  | DeleteMembersResponse;

export type WebsocketEvent = {
  action: string;
  data: EventData;
};
