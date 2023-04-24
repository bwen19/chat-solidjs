import { MemberInfo, MessageInfo } from ".";

export type RoomInfo = {
  id: number;
  name: string;
  cover: string;
  category: string;
  members: MemberInfo[];
  messages: MessageInfo[];
  unreads: number;
  create_at: string;
};

// ---------------- CreateRoom ---------------- //
export type NewRoomRequest = {
  CreateRoom: {
    name: string;
    member_ids: number[];
  };
};
export type NewRoomResponse = {
  room: RoomInfo;
};

// ---------------- UpdateRoom ---------------- //
export type UpdateRoomResquest = {
  UpdateRoom: {
    room_id: number;
    name: string;
  };
};
export type UpdateRoomResponse = {
  room_id: number;
  name: string;
};

// ---------------- DeleteRoom ---------------- //
export type DeleteRoomRequest = {
  DeleteRoom: {
    room_id: number;
  };
};
export type DeleteRoomResponse = {
  room_id: number;
};

// ---------------- LeaveRoom ---------------- //
export type LeaveRoomRequest = {
  LeaveRoom: {
    room_id: number;
  };
};
