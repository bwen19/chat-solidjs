export interface ApiConfig<T extends unknown = unknown, P extends unknown = unknown> {
  url: string;
  method: string;
  path?: boolean;
  responseData?: T;
  requestData?: P;
}

export type UserRole = "admin" | "user";

export type UserInfo = {
  id: number;
  username: string;
  avatar: string;
  nickname: string;
  role: UserRole;
  roomId: number;
  deleted: boolean;
  createAt: Date;
};

export type FriendStatue = "adding" | "accepted" | "deleted";

export type FriendInfo = {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  status: FriendStatue;
  roomId: number;
  first: boolean;
  createAt: Date;
};

export type RoomCategory = "personal" | "private" | "public";

export type RoomInfo = {
  id: number;
  name: string;
  cover: string;
  category: RoomCategory;
  unreads: number;
  createAt: Date;
  members: MemberInfo[];
  messages: MessageInfo[];
};

export type MemberRank = "owner" | "member";

export type MemberInfo = {
  id: number;
  name: string;
  avatar: string;
  rank: MemberRank;
  joinAt: Date;
};

export type MessageKind = "text" | "image" | "file";

export type MessageInfo = {
  roomId: number;
  senderId: number;
  name: string;
  avatar: string;
  content: string;
  fileUrl: string;
  kind: MessageKind;
  divide: boolean;
  sendAt: Date;
};
