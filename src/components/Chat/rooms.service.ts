import { createEffect, createMemo, on } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { ClientEvent } from "@/api";

export type UserCandidate = {
  id: number;
  name: string;
  avatar: string;
  selected: boolean;
  fixed: boolean;
};

export const useNewRoom = () => {
  const [state, { setToast }] = useAppContext();
  const [homeState, { sendMessage }] = useHomeContext();
  const [newRoom, setNewRoom] = createStore({
    total: 0,
    name: "",
    candidates: [],
  });

  const friendList = createMemo(() => homeState.friends.filter((x) => x.status === "accepted").map((x) => x.id));

  createEffect(
    on(
      () => friendList().length,
      () => {
        const friendSet = new Set(friendList());
        setNewRoom(
          produce((s) => {
            for (let i = 0; i < s.candidates.length; i++) {
              const userId = s.candidates[i].id;
              if (!friendSet.delete(userId) && userId !== state.user?.id) {
                s.candidates.splice(i, 1);
                i--;
              }
            }
            for (let i of friendSet) {
              const friend = homeState.friends.find((x) => x.id === i);
              if (friend) {
                s.candidates.push({ id: friend.id, name: friend.nickname, avatar: friend.avatar, selected: false, fixed: false });
              }
            }
          }),
        );
      },
    ),
  );

  const toggleSelection = (userId: number) => {
    setNewRoom(
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

  const setName = (name: string) => setNewRoom("name", name);

  const createRoom = async () => {
    if (newRoom.name.length < 2) {
      setToast("房间名要大于2个字符", "error");
      return;
    }
    const membersId = newRoom.candidates.filter((x) => x.selected).map((x) => x.id);
    if (membersId.length < 2) {
      setToast("人数不能小于2", "error");
      return;
    }

    const evt: ClientEvent = { action: "new-room", data: { name: newRoom.name, membersId } };
    sendMessage(evt);
  };

  return { newRoom, toggleSelection, setName, createRoom };
};
