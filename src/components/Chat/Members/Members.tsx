import { Component, createSignal, For, Show } from "solid-js";
import { ClientEvent, MemberInfo, MemberRank } from "@/api";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { Avatar, Confirm, SearchBox, UserSolid, SettingOutline } from "@/components/common";
import { ModifyMemberModalWrapper } from "./Members.Widget";

// ========================// MemberItem //======================== //

const MemberItem: Component<{ item: MemberInfo }> = (props) => {
  const color = () => {
    switch (props.item.rank) {
      case "owner":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <li class="group flex cursor-default items-center space-x-3 rounded-md px-4 py-2 hover:shadow-sm hover:shadow-gray-400 ">
      <Avatar src={props.item.avatar} class="h-7 w-7 shrink-0 rounded-full" />
      <span class="grow truncate text-sm font-semibold text-gray-500">{props.item.name}</span>
      <UserSolid class={`h-4 w-4 ${color()}`} />
    </li>
  );
};

// ========================// Members //======================== //

const Members: Component<{ members: MemberInfo[]; rank: MemberRank }> = (props) => {
  const [homeState, { sendMessage }] = useHomeContext();

  const [searchedMembers, setSearchedMembers] = createSignal<MemberInfo[]>([]);
  const [searching, setSearching] = createSignal(true);
  const handleSearch = (keyword: string) => {
    const results = props.members.filter((m) => m.name.includes(keyword));
    setSearchedMembers(results);
  };

  const counts = () => (searching() ? searchedMembers().length : props.members.length);

  const handleDeleteRoom = () => {
    const evt: ClientEvent = { action: "delete-room", data: { roomId: homeState.currRoom } };
    sendMessage(evt);
  };
  const handleLeaveRoom = () => {
    const evt: ClientEvent = { action: "leave-room", data: { roomId: homeState.currRoom } };
    sendMessage(evt);
  };

  return (
    <>
      <div class="my-3 w-full px-3">
        <SearchBox onSearch={handleSearch} setSearching={setSearching} placeholder="Search members..." />
      </div>

      <div class="flex items-center justify-between px-5 py-1">
        <p class="text-xs font-bold text-gray-500">
          MEMBERS
          <span class="ml-2 text-sky-700">{counts()}</span>
        </p>
        <Show when={props.rank === "owner"}>
          <ModifyMemberModalWrapper>
            <div class="cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-sky-600 active:text-sky-500">
              <SettingOutline class="h-4 w-4" />
            </div>
          </ModifyMemberModalWrapper>
        </Show>
      </div>
      <ul class="hover:scrollbar no-scrollbar grow overflow-y-scroll px-2 py-1">
        <Show when={searching()} fallback={<For each={props.members}>{(item) => <MemberItem item={item} />}</For>}>
          <For each={searchedMembers()}>{(item) => <MemberItem item={item} />}</For>
        </Show>
      </ul>

      <div class="flex h-12 shrink-0 items-center justify-center border-t">
        <Show
          when={props.rank === "owner"}
          fallback={
            <Confirm onConfirm={handleLeaveRoom}>
              <div class="cursor-pointer rounded-md border border-rose-500 px-2 text-rose-500 hover:bg-rose-500 hover:text-white active:bg-rose-300">Leave</div>
            </Confirm>
          }
        >
          <Confirm onConfirm={handleDeleteRoom}>
            <div class="cursor-pointer rounded-md border border-rose-500 px-2 text-rose-500 hover:bg-rose-500 hover:text-white active:bg-rose-300">Delete</div>
          </Confirm>
        </Show>
      </div>
    </>
  );
};

export default Members;
