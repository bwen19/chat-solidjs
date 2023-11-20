import { Component, createEffect, createMemo, createSignal, on, Show } from "solid-js";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { Avatar, ChatOutline, CloseOutline, EditSolid, MenuOutline } from "../common";
import Members from "./Members";
import Messages from "./Messages";
import Rooms from "./Rooms";
import { UpdateRoomModalWrapper } from "./Chat.Widget";

const ChatPage: Component = () => {
  const [state] = useAppContext();
  const [homeState] = useHomeContext();

  const room = createMemo(() => homeState.rooms.find((r) => r.id === homeState.currRoom));
  const members = createMemo(() => room()?.members || []);
  const rank = createMemo(() => {
    const member = members().find((mb) => mb.id === state.user.id);
    return member?.rank || "member";
  });

  const [openMore, setOpenMore] = createSignal(false);

  createEffect(
    on(
      () => homeState.currRoom,
      () => setOpenMore(false),
    ),
  );

  return (
    <div class="flex h-full">
      <div class="h-full w-64 shrink-0 border-r bg-gray-200">
        <Rooms />
      </div>
      <Show
        when={room()}
        fallback={
          <div class="flex h-full grow items-center justify-center bg-gray-100 py-1">
            <ChatOutline class="h-24 w-24 stroke-gray-300" />
          </div>
        }
      >
        <div class="flex h-full grow flex-col bg-gray-100 py-1">
          <div class="flex h-14 shrink-0 items-center justify-between border-b px-4">
            <Avatar src={room().cover} class="h-9 w-9 shrink-0 rounded-full" />
            <h3 class="font-semibold text-gray-700">{room().name}</h3>
            <div
              onClick={() => setOpenMore((value) => !value)}
              class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-sky-600 active:text-sky-500"
            >
              <MenuOutline class="h-5 w-5" />
            </div>
          </div>
          <Messages />
        </div>
        <Show when={openMore()}>
          <div class="h-full w-56 shrink-0 border-l bg-gray-50">
            <div class="flex h-full flex-col">
              <div class="flex h-8 shrink-0 items-center justify-end px-2">
                <div onClick={() => setOpenMore(false)} class="cursor-pointer text-gray-500 hover:text-gray-800 active:text-gray-500">
                  <CloseOutline class="h-4 w-4" />
                </div>
              </div>
              <div class="flex flex-col items-center space-y-3 border-b py-3">
                <Avatar src={room().cover} class="h-20 w-20 shrink-0 rounded-full" />
                <div class="flex items-center space-x-2">
                  <p class="font-semibold text-gray-700">{room().name}</p>
                  <Show when={rank() === "owner"}>
                    <UpdateRoomModalWrapper room={room()}>
                      <div class="cursor-pointer rounded-full text-sky-600 active:text-sky-500">
                        <EditSolid class="h-4 w-4" />
                      </div>
                    </UpdateRoomModalWrapper>
                  </Show>
                </div>
              </div>
              <Show when={room().category === "public"}>
                <Members members={members()} rank={rank()} />
              </Show>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default ChatPage;
