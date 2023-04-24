import { RoomInfo } from ".";

export type FriendInfo = {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  status: string;
  room_id: number;
  first: boolean;
  create_at: string;
};

// ---------------- AddFriend ---------------- //
export type AddFriendRequest = {
  AddFriend: {
    friend_id: number;
  };
};
export type AddFriendResponse = {
  friend: FriendInfo;
};

// ---------------- AcceptFriend ---------------- //
export type AcceptFriendRequest = {
  AcceptFriend: {
    friend_id: number;
  };
};
export type AcceptFriendResponse = {
  friend: FriendInfo;
  room: RoomInfo;
};

// ---------------- RefuseFriend ---------------- //
export type RefuseFriendRequest = {
  RefuseFriend: {
    friend_id: number;
  };
};
export type RefuseFriendResponse = {
  friend_id: number;
};

// ---------------- DeleteFriend ---------------- //
export type DeleteFriendRequest = {
  DeleteFriend: {
    friend_id: number;
  };
};
export type DeleteFriendResponse = {
  friend_id: number;
  room_id: number;
};
