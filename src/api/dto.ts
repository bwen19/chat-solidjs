import { FriendInfo, MemberInfo, MessageInfo, RoomInfo, UserInfo } from "./model";

// ============================== // Auth // ============================== //

export type LoginRequest = {
  username: string;
  password: string;
  isAdmin: boolean;
};

export type LoginResponse = {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
  expireAt: Date;
};

export type AutoLoginRequest = {
  refreshToken: string;
  isAdmin: boolean;
};

export type RenewTokenRequest = {
  refreshToken: string;
};

export type RenewTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expireAt: Date;
};

export type LogoutRequest = {
  refreshToken: string;
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
  userId: number;
  username?: string;
  password?: string;
  nickname?: string;
  avatar?: string;
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
  oldPassword: string;
  newPassword: string;
};

export type ListUsersRequest = {
  pageId: number;
  pageSize: number;
};

export type ListUsersResponse = {
  total: number;
  users: UserInfo[];
};

export type FindUserResponse = {
  user?: UserInfo;
};

// ============================== // Message // ============================== //

export type InitializeRequest = {};

export type InitializeResponse = {
  rooms: RoomInfo[];
  friends: FriendInfo[];
};

export type NewMessageRequest = {
  roomId: number;
  content: string;
  fileUrl: string;
  kind: string;
};

export type NewMessageResponse = {
  message: MessageInfo;
};

export type SendFileResponse = {
  content: string;
  fileUrl: string;
  kind: string;
};

export type HubStatusResponse = {
  numUsers: number;
  numClients: number;
  numRooms: number;
};

// ============================== // Room // ============================== //

export type NewRoomRequest = {
  name: string;
  membersId: number[];
};

export type NewRoomResponse = {
  room: RoomInfo;
};

export type ChangeCoverResponse = {
  roomId: number;
  cover: string;
};

export type UpdateRoomResquest = {
  roomId: number;
  name: string;
};

export type UpdateRoomResponse = {
  roomId: number;
  name: string;
};

export type DeleteRoomRequest = {
  roomId: number;
};

export type DeleteRoomResponse = {
  roomId: number;
};

export type LeaveRoomRequest = {
  roomId: number;
};

// ============================== // Member // ============================== //

export type AddMembersRequest = {
  roomId: number;
  membersId: number[];
};

export type AddMembersResponse = {
  roomId: number;
  members: MemberInfo[];
};

export type DeleteMembersRequest = {
  roomId: number;
  membersId: number[];
};

export type DeleteMembersResponse = {
  roomId: number;
  membersId: number[];
};

// ============================== // Friend // ============================== //

export type AddFriendRequest = {
  friendId: number;
};

export type AddFriendResponse = {
  friend: FriendInfo;
};

export type AcceptFriendRequest = {
  friendId: number;
};

export type AcceptFriendResponse = {
  friend: FriendInfo;
  room: RoomInfo;
};

export type RefuseFriendRequest = {
  friendId: number;
};

export type RefuseFriendResponse = {
  friendId: number;
};

export type DeleteFriendRequest = {
  friendId: number;
};

export type DeleteFriendResponse = {
  friendId: number;
  roomId: number;
};
