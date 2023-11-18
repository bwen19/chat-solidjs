import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { RoomInfo } from "@/api";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { fmtLastDate } from "@/utils/time";
import { Avatar, SearchBox, AddOutline } from "../common";
import { NewRoomModalWrapper } from "./Chat.Widgets";

const RoomItem: Component<{ item: RoomInfo }> = (props) => {
  const [homeState, { navRoom }] = useHomeContext();
  const selected = createMemo(() => homeState.currRoom === props.item.id);

  const latestMsg = createMemo(() => {
    const index = props.item.messages.length - 1;
    if (index >= 0) return props.item.messages[index];
    else return undefined;
  });

  const msgContent = createMemo(() => {
    if (!latestMsg()) return "";
    const content = latestMsg().kind === "text" ? latestMsg().content : "[文件]";
    if (props.item.category === "public") return `${latestMsg().name}: ${content}`;
    else return content;
  });

  return (
    <li
      onClick={() => navRoom(props.item.id)}
      class="group flex w-full cursor-pointer items-start space-x-3 p-3 hover:bg-sky-600"
      classList={{ "bg-sky-600": selected() }}
    >
      <div class="shrink-0 rounded-full" classList={{ "group-hover:ring-2 group-hover:ring-sky-100": selected() }}>
        <Avatar src={props.item.cover} class="h-10 w-10 rounded-full" />
      </div>
      <div class="w-full min-w-0 text-white">
        <div class="flex items-center justify-between space-x-2">
          <p class="truncate text-sm font-semibold" classList={{ "text-gray-600 group-hover:text-white": !selected() }}>
            {props.item.name}
          </p>
          <p class="shrink-0 text-xs" classList={{ "text-gray-400 group-hover:text-white": !selected() }}>
            <Show when={latestMsg()}>{fmtLastDate(latestMsg().sendAt, homeState.today)}</Show>
          </p>
        </div>
        <div class="mt-1 flex items-center justify-between space-x-2">
          <p class="truncate py-0.5 text-xs font-medium" classList={{ "text-gray-400 group-hover:text-white": !selected() }}>
            {msgContent()}
          </p>

          <p class="shrink-0 rounded-full bg-rose-500 p-0.5 px-1.5 text-xs" classList={{ invisible: !Boolean(props.item.unreads) }}>
            {props.item.unreads}
          </p>
        </div>
      </div>
    </li>
  );
};

const Rooms: Component = () => {
  const [homeState] = useHomeContext();
  const [searchedRooms, setSearchedRooms] = createSignal<RoomInfo[]>([]);
  const [searching, setSearching] = createSignal(false);

  const handleSearch = (keyword: string) => {
    const results = homeState.rooms.filter((room) => room.name.includes(keyword));
    setSearchedRooms(results);
  };

  const counts = () => (searching() ? searchedRooms().length : homeState.rooms.length);

  return (
    <div class="flex flex-col pt-3">
      <div class="my-2 w-full px-3">
        <SearchBox onSearch={handleSearch} setSearching={setSearching} placeholder="Search rooms..." />
      </div>

      <div class="my-3 flex items-center justify-between px-5">
        <p class="text-xs font-semibold text-gray-500">
          CHAT ROOMS
          <span class="ml-2 font-bold text-sky-700">{counts()}</span>
        </p>
        <NewRoomModalWrapper>
          <div class="cursor-pointer rounded-full p-2 text-sky-600 hover:bg-gray-300 active:text-sky-500">
            <AddOutline class="w-h h-5" />
          </div>
        </NewRoomModalWrapper>
      </div>
      <div class="hover:scrollbar no-scrollbar overflow-y-scroll">
        <ul class="divide-y divide-gray-300">
          <Show when={searching()} fallback={<For each={homeState.rooms}>{(item) => <RoomItem item={item} />}</For>}>
            <For each={searchedRooms()}>{(item) => <RoomItem item={item} />}</For>
          </Show>
        </ul>
      </div>
    </div>
  );
};

export default Rooms;
