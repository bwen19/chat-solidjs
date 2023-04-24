import { produce, SetStoreFunction } from "solid-js/store";
import { ToastKind } from "@/AppContext";
import {
  AcceptFriendResponse,
  AddFriendResponse,
  AddMembersResponse,
  DeleteFriendResponse,
  DeleteMembersResponse,
  DeleteRoomResponse,
  InitialResponse,
  NewMessageResponse,
  UpdateRoomResponse,
  NewRoomResponse,
  RefuseFriendResponse,
  InitialRequest,
} from "@/api";
import { todayEndTime } from "@/utils/time";
import { HomeContextState } from "./HomeContext";

export class WebSocketService {
  private wsInstance: WebSocket | undefined;
  private reconnectable = true;

  constructor(private setHomeState: SetStoreFunction<HomeContextState>, private setToast: (msg: string, kind: ToastKind) => void) {
    this.setHomeState = setHomeState;
    this.setToast = setToast;
  }

  connect(timestamp?: number) {
    const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
    this.wsInstance = new WebSocket(`${wsProtocol}//${location.host}/ws`);

    this.wsInstance.onopen = () => {
      this.reconnectable = true;
      if (timestamp) {
        const req: InitialRequest = { Initialize: { timestamp } };
        this.wsInstance.send(JSON.stringify(req));
      }
    };

    this.wsInstance.onclose = async (ev) => {
      if (ev.code !== 1000 && this.reconnectable) {
        this.reconnectable = false;
        console.error("WebSocket disconnected:", ev.code, ev.reason);
        setTimeout(() => this.connect(), 1000);
      } else {
        this.setHomeState("disconnected", true);
        if (ev.reason) this.setToast(ev.reason, "error");
      }
    };

    this.wsInstance.onmessage = (ev) => {
      const data = JSON.parse(ev.data);

      if ("Ping" in data) {
        this.wsInstance.send(JSON.stringify({ Pong: 456 }));
        const nowadays = todayEndTime();
        this.setHomeState(
          produce((s) => {
            if (s.today.getTime() < nowadays.getTime()) s.today = nowadays;
          })
        );
      } else if ("ErrMessage" in data) {
        const message = data["ErrMessage"] as string;
        this.setToast(message, "error");
      } else if ("Initialized" in data) {
        const resp = data["Initialized"] as InitialResponse;
        const num = resp.friends.filter((v) => v.status === "adding" && !v.first).length;
        this.setHomeState({ rooms: resp.rooms, friends: resp.friends, numNewFriends: num });
      } else if ("ReceivedMessage" in data) {
        const resp = data["ReceivedMessage"] as NewMessageResponse;
        this.setHomeState(
          produce((s) => {
            const index = s.rooms.findIndex((x) => x.id === resp.room_id);
            if (index !== -1) {
              const [room, _] = s.rooms.splice(index, 1);
              const date = new Date(room.messages[room.messages.length - 1]?.send_at);
              if (s.today.getTime() - date.getTime() > 86400000) resp.message.divide = true;

              room.messages.push(resp.message);
              if (s.currPage !== "chat" || s.currRoom !== resp.room_id) {
                room.unreads++;
                s.totalUnreads++;
              }
              s.rooms.unshift(room);
            }
          })
        );
      } else if ("JoinedRoom" in data) {
        const resp = data["JoinedRoom"] as NewRoomResponse;
        this.setHomeState(produce((s) => s.rooms.unshift(resp.room)));
      } else if ("UpdatedRoom" in data) {
        const resp = data["UpdatedRoom"] as UpdateRoomResponse;
        this.setHomeState(
          produce((s) => {
            const index = s.rooms.findIndex((x) => x.id === resp.room_id);
            if (index !== -1) s.rooms[index].name = resp.name;
          })
        );
      } else if ("DeletedRoom" in data) {
        const resp = data["DeletedRoom"] as DeleteRoomResponse;
        this.setHomeState(
          produce((s) => {
            const index = s.rooms.findIndex((x) => x.id === resp.room_id);
            if (index !== -1) s.rooms.splice(index, 1);
            if (s.currRoom === resp.room_id) s.currRoom = 0;
          })
        );
      } else if ("AddedMembers" in data) {
        const resp = data["AddedMembers"] as AddMembersResponse;
        this.setHomeState(
          produce((s) => {
            const index = s.rooms.findIndex((x) => x.id === resp.room_id);
            if (index !== -1) s.rooms[index].members.push(...resp.members);
          })
        );
      } else if ("DeletedMembers" in data) {
        const resp = data["DeletedMembers"] as DeleteMembersResponse;
        this.setHomeState(
          produce((s) => {
            const index = s.rooms.findIndex((x) => x.id === resp.room_id);
            if (index !== -1) {
              for (let i = 0; i < s.rooms[index].members.length; i++) {
                if (resp.member_ids.includes(s.rooms[index].members[i].id)) {
                  s.rooms[index].members.splice(i, 1);
                  i--;
                }
              }
            }
          })
        );
      } else if ("AddedFriend" in data) {
        const resp = data["AddedFriend"] as AddFriendResponse;
        this.setHomeState(
          produce((s) => {
            s.friends.push(resp.friend);
            if (!resp.friend.first) s.numNewFriends++;
          })
        );
      } else if ("AcceptedFriend" in data) {
        const resp = data["AcceptedFriend"] as AcceptFriendResponse;
        this.setHomeState(
          produce((s) => {
            const index = s.friends.findIndex((x) => x.id === resp.friend.id);
            if (index !== -1) {
              s.friends[index] = resp.friend;
              if (!resp.friend.first) s.numNewFriends--;
            } else {
              s.friends.push(resp.friend);
            }
            s.rooms.unshift(resp.room);
          })
        );
      } else if ("RefusedFriend" in data) {
        const resp = data["RefusedFriend"] as RefuseFriendResponse;
        this.setHomeState(
          produce((s) => {
            const index = s.friends.findIndex((x) => x.id === resp.friend_id);
            if (index !== -1) {
              const [removedFriend, _] = s.friends.splice(index, 1);
              if (!removedFriend.first) s.numNewFriends--;
            }
          })
        );
      } else if ("DeletedFriend" in data) {
        const resp = data["DeletedFriend"] as DeleteFriendResponse;
        this.setHomeState(
          produce((s) => {
            const index = s.friends.findIndex((x) => x.id === resp.friend_id);
            if (index !== -1) s.friends.splice(index, 1);
            if (s.currFriend === resp.friend_id) s.currFriend = 0;

            const rindex = s.rooms.findIndex((x) => x.id === resp.room_id);
            if (rindex !== -1) s.rooms.splice(index, 1);
            if (s.currRoom === resp.room_id) s.currRoom = 0;
          })
        );
      }
    };
  }

  sendMessage(value: any) {
    if (this.wsInstance.readyState === WebSocket.OPEN) this.wsInstance.send(JSON.stringify(value));
    else this.setToast("WebSocket is not connected", "error");
  }

  disconnect() {
    this.reconnectable = false;
    this.wsInstance.close();
    this.wsInstance = undefined;
  }
}
