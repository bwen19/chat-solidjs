import { produce, SetStoreFunction } from "solid-js/store";
import { ToastKind } from "@/AppContext";
import {
  AcceptFriendResponse,
  AddFriendResponse,
  AddMembersResponse,
  DeleteFriendResponse,
  DeleteMembersResponse,
  DeleteRoomResponse,
  NewMessageResponse,
  UpdateRoomResponse,
  NewRoomResponse,
  RefuseFriendResponse,
  InitializeResponse,
  ServerEvent,
  ClientEvent,
  ChangeCoverResponse,
} from "@/api";
import { HomeContextState } from "./HomeContext";

export class WebSocketService {
  private wsInstance: WebSocket | undefined;
  private reconnectable = true;

  constructor(
    private setHomeState: SetStoreFunction<HomeContextState>,
    private setToast: (msg: string, kind: ToastKind) => void,
  ) {
    this.setHomeState = setHomeState;
    this.setToast = setToast;
  }

  connect(end_time: Date, accessToken: string) {
    const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
    this.wsInstance = new WebSocket(`${wsProtocol}//${location.host}/ws`, ["chat", accessToken]);

    this.wsInstance.onopen = () => {
      this.reconnectable = true;
      const evt: ClientEvent = { action: "initialize", data: { timestamp: end_time.getTime() } };
      this.sendWsMessage(evt);
    };

    this.wsInstance.onclose = async (ev) => {
      if (ev.code !== 1000 && this.reconnectable) {
        this.reconnectable = false;
        console.error("WebSocket disconnected:", ev.code, ev.reason);
        setTimeout(() => this.connect(end_time, accessToken), 3000);
      } else {
        this.setHomeState("disconnected", true);
        if (ev.reason) this.setToast(ev.reason, "error");
      }
    };

    this.wsInstance.onmessage = (ev) => {
      const event = JSON.parse(ev.data) as ServerEvent;

      switch (event.action) {
        case "toast":
          this.setToast(event.data, "error");
          break;
        case "initialize":
          this.initialize(event.data);
          break;
        case "new-message":
          this.newMessage(event.data);
          break;
        case "new-room":
          this.newRoom(event.data);
          break;
        case "change-cover":
          this.changeCover(event.data);
          break;
        case "update-room":
          this.updateRoom(event.data);
          break;
        case "delete-room":
          this.deleteRoom(event.data);
          break;
        case "add-members":
          this.addMembers(event.data);
          break;
        case "delete-members":
          this.deleteMembers(event.data);
          break;
        case "add-friend":
          this.addFriend(event.data);
          break;
        case "accept-friend":
          this.acceptFriend(event.data);
          break;
        case "refuse-friend":
          this.refuseFriend(event.data);
          break;
        case "delete-friend":
          this.deleteFriend(event.data);
          break;
        default:
          const _exhaustiveCheck: never = event;
      }
    };
  }

  private initialize(rsp: InitializeResponse) {
    const num = rsp.friends.filter((v) => v.status === "adding" && v.first).length;
    this.setHomeState({ rooms: rsp.rooms, friends: rsp.friends, numNewFriends: num });
  }

  private newMessage(rsp: NewMessageResponse) {
    this.setHomeState(
      produce((s) => {
        const roomId = rsp.message.roomId;
        const index = s.rooms.findIndex((x) => x.id === roomId);
        if (index !== -1) {
          const [room, _] = s.rooms.splice(index, 1);
          const date = new Date(room.messages[room.messages.length - 1]?.sendAt);
          if (s.today.getTime() - date.getTime() > 86400000) rsp.message.divide = true;

          room.messages.push(rsp.message);
          if (s.currPage !== "chat" || s.currRoom !== roomId) {
            room.unreads++;
            s.totalUnreads++;
          }
          s.rooms.unshift(room);
        }
      }),
    );
  }

  private addFriend(rsp: AddFriendResponse) {
    this.setHomeState(
      produce((s) => {
        s.friends.push(rsp.friend);
        if (rsp.friend.first) s.numNewFriends++;
      }),
    );
  }

  private acceptFriend(rsp: AcceptFriendResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.friends.findIndex((x) => x.id === rsp.friend.id);
        if (index !== -1) {
          s.friends[index] = rsp.friend;
          if (rsp.friend.first) s.numNewFriends--;
        } else {
          s.friends.push(rsp.friend);
        }
        s.rooms.unshift(rsp.room);
      }),
    );
  }

  private refuseFriend(rsp: RefuseFriendResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.friends.findIndex((x) => x.id === rsp.friendId);
        if (index !== -1) {
          const [removedFriend, _] = s.friends.splice(index, 1);
          if (removedFriend.first) s.numNewFriends--;
        }
      }),
    );
  }

  private deleteFriend(rsp: DeleteFriendResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.friends.findIndex((x) => x.id === rsp.friendId);
        if (index !== -1) s.friends.splice(index, 1);
        if (s.currFriend === rsp.friendId) s.currFriend = 0;

        const rindex = s.rooms.findIndex((x) => x.id === rsp.roomId);
        if (rindex !== -1) {
          const rooms = s.rooms.splice(rindex, 1);
          for (let room of rooms) {
            s.totalUnreads -= room.unreads;
          }
        }
        if (s.currRoom === rsp.roomId) s.currRoom = 0;
      }),
    );
  }

  private newRoom(rsp: NewRoomResponse) {
    this.setHomeState(produce((s) => s.rooms.unshift(rsp.room)));
  }

  private changeCover(rsp: ChangeCoverResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.roomId);
        if (index !== -1) s.rooms[index].cover = rsp.cover;
      }),
    );
  }

  private updateRoom(rsp: UpdateRoomResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.roomId);
        if (index !== -1) s.rooms[index].name = rsp.name;
      }),
    );
  }

  private deleteRoom(rsp: DeleteRoomResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.roomId);
        if (index !== -1) {
          const rooms = s.rooms.splice(index, 1);
          for (let room of rooms) {
            s.totalUnreads -= room.unreads;
          }
        }
        if (s.currRoom === rsp.roomId) s.currRoom = 0;
      }),
    );
  }

  private addMembers(rsp: AddMembersResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.roomId);
        if (index !== -1) s.rooms[index].members.push(...rsp.members);
      }),
    );
  }

  private deleteMembers(rsp: DeleteMembersResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.roomId);
        if (index !== -1) {
          for (let i = 0; i < s.rooms[index].members.length; i++) {
            if (rsp.membersId.includes(s.rooms[index].members[i].id)) {
              s.rooms[index].members.splice(i, 1);
              i--;
            }
          }
        }
      }),
    );
  }

  sendWsMessage(evt: ClientEvent) {
    if (this.wsInstance.readyState === WebSocket.OPEN) {
      this.wsInstance.send(JSON.stringify(evt));
    } else {
      this.setToast("WebSocket is not connected", "error");
    }
  }

  disconnect() {
    this.reconnectable = false;
    if (this.wsInstance) this.wsInstance.close();
    this.wsInstance = undefined;
  }
}
