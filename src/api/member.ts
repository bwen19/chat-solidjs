export type MemberInfo = {
  id: number;
  name: string;
  avatar: string;
  rank: string;
  join_at: string;
};

// ---------------- AddMembers ---------------- //
export type AddMembersRequest = {
  AddMembers: {
    room_id: number;
    member_ids: number[];
  };
};
export type AddMembersResponse = {
  room_id: number;
  members: MemberInfo[];
};

// ---------------- DeleteMembers ---------------- //
export type DeleteMembersRequest = {
  DeleteMembers: {
    room_id: number;
    member_ids: number[];
  };
};
export type DeleteMembersResponse = {
  room_id: number;
  member_ids: number[];
};
