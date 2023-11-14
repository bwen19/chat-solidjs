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
  InitializeRequest,
  InitializeResponse,
  WebsocketEvent,
  EventData,
} from "@/api";
import { todayEndTime } from "@/utils/time";
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

  connect(end_time: Date) {
    const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
    this.wsInstance = new WebSocket(`${wsProtocol}//${location.host}/ws`);

    this.wsInstance.onopen = () => {
      this.reconnectable = true;
      const req: InitializeRequest = { timestamp: end_time.getTime() };
      this.sendWsMessage("initialize", req);
    };

    this.wsInstance.onclose = async (ev) => {
      if (ev.code !== 1000 && this.reconnectable) {
        this.reconnectable = false;
        console.error("WebSocket disconnected:", ev.code, ev.reason);
        setTimeout(() => this.connect(end_time), 1000);
      } else {
        this.setHomeState("disconnected", true);
        if (ev.reason) this.setToast(ev.reason, "error");
      }
    };

    this.wsInstance.onmessage = (ev) => {
      const event = JSON.parse(ev.data) as WebsocketEvent;
      console.log("receive ", event.action);

      switch (event.action) {
        case "toast":
          this.setToast(event.data as string, "error");
          break;
        case "initialize":
          this.initialize(event.data as InitializeResponse);
          break;
        case "new-message":
          this.newMessage(event.data as NewMessageResponse);
          break;
        case "new-room":
          this.newRoom(event.data as NewRoomResponse);
          break;
        case "update-room":
          this.updateRoom(event.data as UpdateRoomResponse);
          break;
        case "delete-room":
          this.deleteRoom(event.data as DeleteRoomResponse);
          break;
        case "add-members":
          this.addMembers(event.data as AddMembersResponse);
          break;
        case "deleted-members":
          this.deleteMembers(event.data as DeleteMembersResponse);
          break;
        case "add-friend":
          this.addFriend(event.data as AddFriendResponse);
          break;
        case "accept-friend":
          this.acceptFriend(event.data as AcceptFriendResponse);
          break;
        case "refuse-friend":
          this.refuseFriend(event.data as RefuseFriendResponse);
          break;
        case "delete-friend":
          this.deleteFriend(event.data as DeleteFriendResponse);
          break;
      }
    };
  }

  private initialize(rsp: InitializeResponse) {
    const num = rsp.friends.filter((v) => v.status === "adding" && !v.first).length;
    this.setHomeState({ rooms: rsp.rooms, friends: rsp.friends, numNewFriends: num });
  }

  private newMessage(rsp: NewMessageResponse) {
    this.setHomeState(
      produce((s) => {
        const room_id = rsp.message.room_id;
        const index = s.rooms.findIndex((x) => x.id === room_id);
        if (index !== -1) {
          const [room, _] = s.rooms.splice(index, 1);
          const date = new Date(room.messages[room.messages.length - 1]?.send_at);
          if (s.today.getTime() - date.getTime() > 86400000) rsp.message.divide = true;

          room.messages.push(rsp.message);
          if (s.currPage !== "chat" || s.currRoom !== room_id) {
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
        if (!rsp.friend.first) s.numNewFriends++;
      }),
    );
  }

  private acceptFriend(rsp: AcceptFriendResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.friends.findIndex((x) => x.id === rsp.friend.id);
        if (index !== -1) {
          s.friends[index] = rsp.friend;
          if (!rsp.friend.first) s.numNewFriends--;
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
        const index = s.friends.findIndex((x) => x.id === rsp.friend_id);
        if (index !== -1) {
          const [removedFriend, _] = s.friends.splice(index, 1);
          if (!removedFriend.first) s.numNewFriends--;
        }
      }),
    );
  }

  private deleteFriend(rsp: DeleteFriendResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.friends.findIndex((x) => x.id === rsp.friend_id);
        if (index !== -1) s.friends.splice(index, 1);
        if (s.currFriend === rsp.friend_id) s.currFriend = 0;

        const rindex = s.rooms.findIndex((x) => x.id === rsp.room_id);
        if (rindex !== -1) s.rooms.splice(index, 1);
        if (s.currRoom === rsp.room_id) s.currRoom = 0;
      }),
    );
  }

  private newRoom(rsp: NewRoomResponse) {
    this.setHomeState(produce((s) => s.rooms.unshift(rsp.room)));
  }

  private updateRoom(rsp: UpdateRoomResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.room_id);
        if (index !== -1) s.rooms[index].name = rsp.name;
      }),
    );
  }

  private deleteRoom(rsp: DeleteRoomResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.room_id);
        if (index !== -1) s.rooms.splice(index, 1);
        if (s.currRoom === rsp.room_id) s.currRoom = 0;
      }),
    );
  }

  private addMembers(rsp: AddMembersResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.room_id);
        if (index !== -1) s.rooms[index].members.push(...rsp.members);
      }),
    );
  }

  private deleteMembers(rsp: DeleteMembersResponse) {
    this.setHomeState(
      produce((s) => {
        const index = s.rooms.findIndex((x) => x.id === rsp.room_id);
        if (index !== -1) {
          for (let i = 0; i < s.rooms[index].members.length; i++) {
            if (rsp.members_id.includes(s.rooms[index].members[i].id)) {
              s.rooms[index].members.splice(i, 1);
              i--;
            }
          }
        }
      }),
    );
  }

  sendWsMessage(action: string, data: EventData) {
    if (this.wsInstance.readyState === WebSocket.OPEN) {
      const wsEvent: WebsocketEvent = { action, data };
      this.wsInstance.send(JSON.stringify(wsEvent));
    } else {
      this.setToast("WebSocket is not connected", "error");
    }
  }

  disconnect() {
    this.reconnectable = false;
    this.wsInstance.close();
    this.wsInstance = undefined;
  }
}
