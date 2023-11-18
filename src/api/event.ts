import {
  AcceptFriendRequest,
  AcceptFriendResponse,
  AddFriendRequest,
  AddFriendResponse,
  AddMembersRequest,
  AddMembersResponse,
  DeleteFriendRequest,
  DeleteFriendResponse,
  DeleteMembersRequest,
  DeleteMembersResponse,
  DeleteRoomRequest,
  DeleteRoomResponse,
  InitializeRequest,
  InitializeResponse,
  LeaveRoomRequest,
  NewMessageRequest,
  NewMessageResponse,
  NewRoomRequest,
  NewRoomResponse,
  RefuseFriendRequest,
  RefuseFriendResponse,
  UpdateRoomResponse,
  UpdateRoomResquest,
} from "./dto";

// ============================== // ClientEvent // ============================== //

type CliInitialize = {
  action: "initialize";
  data: InitializeRequest;
};

type CliNewMessage = {
  action: "new-message";
  data: NewMessageRequest;
};

type CliNewRoom = {
  action: "new-room";
  data: NewRoomRequest;
};

type CliUpdateRoom = {
  action: "update-room";
  data: UpdateRoomResquest;
};

type CliDeleteRoom = {
  action: "delete-room";
  data: DeleteRoomRequest;
};

type CliLeaveRoom = {
  action: "leave-room";
  data: LeaveRoomRequest;
};

type CliAddMembers = {
  action: "add-members";
  data: AddMembersRequest;
};

type CliDeleteMembers = {
  action: "delete-members";
  data: DeleteMembersRequest;
};

type CliAddFriend = {
  action: "add-friend";
  data: AddFriendRequest;
};

type CliAcceptFriend = {
  action: "accept-friend";
  data: AcceptFriendRequest;
};

type CliRefuseFriend = {
  action: "refuse-friend";
  data: RefuseFriendRequest;
};

type CliDeleteFriend = {
  action: "delete-friend";
  data: DeleteFriendRequest;
};

export type ClientEvent =
  | CliInitialize
  | CliNewMessage
  | CliNewRoom
  | CliUpdateRoom
  | CliDeleteRoom
  | CliLeaveRoom
  | CliAddMembers
  | CliDeleteMembers
  | CliAddFriend
  | CliAcceptFriend
  | CliRefuseFriend
  | CliDeleteFriend;

// ============================== // ServerEvent // ============================== //

type SrvErrMessage = {
  action: "toast";
  data: string;
};

type SrvInitialize = {
  action: "initialize";
  data: InitializeResponse;
};

type SrvNewMessage = {
  action: "new-message";
  data: NewMessageResponse;
};

type SrvNewRoom = {
  action: "new-room";
  data: NewRoomResponse;
};

type SrvUpdateRoom = {
  action: "update-room";
  data: UpdateRoomResponse;
};

type SrvDeleteRoom = {
  action: "delete-room";
  data: DeleteRoomResponse;
};

type SrvAddMembers = {
  action: "add-members";
  data: AddMembersResponse;
};

type SrvDeleteMembers = {
  action: "delete-members";
  data: DeleteMembersResponse;
};

type SrvAddFriend = {
  action: "add-friend";
  data: AddFriendResponse;
};

type SrvAcceptFriend = {
  action: "accept-friend";
  data: AcceptFriendResponse;
};

type SrvRefuseFriend = {
  action: "refuse-friend";
  data: RefuseFriendResponse;
};

type SrvDeleteFriend = {
  action: "delete-friend";
  data: DeleteFriendResponse;
};

export type ServerEvent =
  | SrvErrMessage
  | SrvInitialize
  | SrvNewMessage
  | SrvNewRoom
  | SrvUpdateRoom
  | SrvDeleteRoom
  | SrvAddMembers
  | SrvDeleteMembers
  | SrvAddFriend
  | SrvAcceptFriend
  | SrvRefuseFriend
  | SrvDeleteFriend;
