export interface ApiConfig<T extends unknown = unknown, P extends unknown = unknown> {
  url: string;
  method: string;
  path?: boolean;
  responseData?: T;
  requestData?: P;
}

export type UserInfo = {
  id: number;
  username: string;
  avatar: string;
  nickname: string;
  role: string;
  room_id: number;
  deleted: boolean;
  create_at: Date;
};

export type FriendInfo = {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  status: string;
  room_id: number;
  first: boolean;
  create_at: Date;
};

export type RoomInfo = {
  id: number;
  name: string;
  cover: string;
  category: string;
  unreads: number;
  create_at: string;
  members: MemberInfo[];
  messages: MessageInfo[];
};

export type MemberInfo = {
  id: number;
  name: string;
  avatar: string;
  rank: string;
  join_at: Date;
};

export type MessageInfo = {
  room_id: number;
  sender_id: number;
  name: string;
  avatar: string;
  content: string;
  kind: string;
  divide: boolean;
  send_at: Date;
};
