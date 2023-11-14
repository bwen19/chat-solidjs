import { createEffect, createMemo, on } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { AddMembersRequest, DeleteMembersRequest } from "@/api";
import { UserCandidate } from "./rooms.service";

export const useAddMembers = () => {
  const [_, { setToast }] = useAppContext();
  const [homeState, { sendMessage }] = useHomeContext();
  const [newMembers, setNewMembers] = createStore<{ total: number; candidates: UserCandidate[] }>({
    total: 0,
    candidates: [],
  });

  const memberIds = createMemo(() => {
    const room = homeState.rooms.find((r) => r.id === homeState.currRoom);
    return room?.members?.map((m) => m.id) || [];
  });
  const friendList = createMemo(() => homeState.friends.filter((x) => x.status === "accepted").map((x) => x.id));

  createEffect(() => {
    const friendSet = new Set(friendList());
    setNewMembers(
      produce((s) => {
        for (let i = 0; i < s.candidates.length; i++) {
          const userId = s.candidates[i].id;
          if (!friendSet.delete(userId)) {
            s.candidates.splice(i, 1);
            i--;
          }
        }
        for (let i of friendSet) {
          const friend = homeState.friends.find((x) => x.id === i);
          if (friend) {
            if (memberIds().includes(friend.id)) {
              s.candidates.push({ id: friend.id, name: friend.nickname, avatar: friend.avatar, selected: true, fixed: true });
            } else {
              s.candidates.push({ id: friend.id, name: friend.nickname, avatar: friend.avatar, selected: false, fixed: false });
            }
          }
        }
        s.total = s.candidates.filter((x) => x.selected && !x.fixed).length;
      }),
    );
  });

  const addSelection = (userId: number) => {
    setNewMembers(
      produce((s) => {
        const index = s.candidates.findIndex((x) => x.id === userId);
        if (index !== -1 && !s.candidates[index].fixed) {
          const selected = s.candidates[index].selected;
          if (selected) {
            s.candidates[index].selected = false;
            s.total--;
          } else {
            s.candidates[index].selected = true;
            s.total++;
          }
        }
      }),
    );
  };

  const addMembers = async () => {
    const members_id = newMembers.candidates.filter((x) => x.selected && !x.fixed).map((x) => x.id);
    if (members_id.length === 0) {
      setToast("人数不能为空", "error");
      return;
    }

    const req: AddMembersRequest = { room_id: homeState.currRoom, members_id };
    sendMessage("add-members", req);
  };

  return { newMembers, addSelection, addMembers };
};

export const useDeleteMembers = () => {
  const [state, { setToast }] = useAppContext();
  const [homeState, { sendMessage }] = useHomeContext();
  const [delMembers, setDelMembers] = createStore<{ total: number; candidates: UserCandidate[] }>({
    total: 0,
    candidates: [],
  });

  const memberList = createMemo(() => {
    const room = homeState.rooms.find((r) => r.id === homeState.currRoom);
    return room?.members || [];
  });

  createEffect(
    on(
      () => memberList().length,
      () => {
        const memberSet = new Set(memberList().map((x) => x.id));
        setDelMembers(
          produce((s) => {
            for (let i = 0; i < s.candidates.length; i++) {
              const userId = s.candidates[i].id;
              if (!memberSet.delete(userId)) {
                s.candidates.splice(i, 1);
                i--;
              }
            }
            for (let i of memberSet) {
              const member = memberList().find((x) => x.id === i);
              if (member) {
                if (member.id !== state.user.id) {
                  s.candidates.push({ id: member.id, name: member.name, avatar: member.avatar, selected: false, fixed: false });
                }
              }
            }
            s.total = s.candidates.filter((x) => x.selected && !x.fixed).length;
          }),
        );
      },
    ),
  );

  const delSelection = (userId: number) => {
    setDelMembers(
      produce((s) => {
        const index = s.candidates.findIndex((x) => x.id === userId);
        if (index !== -1 && !s.candidates[index].fixed) {
          const selected = s.candidates[index].selected;
          if (selected) {
            s.candidates[index].selected = false;
            s.total--;
          } else {
            s.candidates[index].selected = true;
            s.total++;
          }
        }
      }),
    );
  };

  const deleteMembers = () => {
    const members_id = delMembers.candidates.filter((x) => x.selected && !x.fixed).map((x) => x.id);
    if (members_id.length === 0) {
      setToast("人数不能为空", "error");
      return;
    }

    const req: DeleteMembersRequest = { room_id: homeState.currRoom, members_id };
    sendMessage("delete-members", req);
  };

  return { delMembers, delSelection, deleteMembers };
};
