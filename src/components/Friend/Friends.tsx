import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { FriendInfo } from "@/api";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { Avatar, SearchBox, AddOutline, UserAddSolid } from "../common";
import { AddFriendModalWrapper } from "./Friend.Widget";

const FriendItem: Component<{ item: FriendInfo }> = (props) => {
  const [homeState, { navFriend }] = useHomeContext();
  const selected = createMemo(() => props.item.id === homeState.currFriend);

  return (
    <li
      onClick={() => navFriend(props.item.id)}
      class="group flex w-full cursor-pointer items-center space-x-3 p-3 text-white hover:bg-sky-600"
      classList={{ "bg-sky-600": selected() }}
    >
      <div class="shrink-0 rounded-full" classList={{ "group-hover:ring-2 group-hover:ring-sky-100": selected() }}>
        <Avatar src={props.item.avatar} class="h-10 w-10 rounded-full" />
      </div>
      <div class="min-w-0 truncate font-semibold" classList={{ "group-hover:text-white text-gray-600": !selected() }}>
        {props.item.nickname}
      </div>
    </li>
  );
};

const NewFriendItem: Component = () => {
  const [homeState, { navFriend }] = useHomeContext();
  const selected = createMemo(() => homeState.currFriend === -1);

  return (
    <li
      onClick={() => navFriend(-1)}
      class="group flex w-full cursor-pointer items-center space-x-3 p-3 text-white hover:bg-sky-600"
      classList={{ "bg-sky-600": selected() }}
    >
      <div class="shrink-0 rounded-full" classList={{ "group-hover:ring-2 group-hover:ring-sky-100": selected() }}>
        <div class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-400">
          <UserAddSolid class="h-5 w-5 text-gray-100" />
        </div>
      </div>
      <div class="min-w-0 grow truncate font-semibold" classList={{ "group-hover:text-white text-gray-600": !selected() }}>
        New Friend
      </div>
      <p class="shrink-0 rounded-full bg-rose-500 p-0.5 px-1.5 text-xs" classList={{ invisible: !Boolean(homeState.numNewFriends) }}>
        {homeState.numNewFriends}
      </p>
    </li>
  );
};

const Friends: Component = () => {
  const [homeState] = useHomeContext();
  const [searchedFriends, setsearchedFriends] = createSignal<FriendInfo[]>([]);
  const [searching, setSearching] = createSignal(false);

  const friends = createMemo(() => homeState.friends.filter((f) => f.status === "accepted"));

  const handleSearch = (keyword: string) => {
    const results = friends().filter((friend) => friend.nickname.includes(keyword) || friend.username.includes(keyword));
    setsearchedFriends(results);
  };

  const counts = () => (searching() ? searchedFriends().length : friends().length);

  return (
    <div class="flex flex-col pt-3">
      <div class="my-2 w-full px-3">
        <SearchBox onSearch={handleSearch} setSearching={setSearching} placeholder="Search friends..." />
      </div>

      <div class="my-3 flex items-center justify-between px-5">
        <p class="text-xs font-semibold text-gray-500">
          MY FRIENDS
          <span class="ml-2 font-bold text-sky-600">{counts()}</span>
        </p>
        <AddFriendModalWrapper>
          <div class="cursor-pointer rounded-full p-2 text-sky-600 hover:bg-gray-300 active:text-sky-500">
            <AddOutline class="w-h h-5" />
          </div>
        </AddFriendModalWrapper>
      </div>
      <div class="hover:scrollbar no-scrollbar overflow-y-scroll">
        <ul class="divide-y divide-gray-300">
          <Show
            when={searching()}
            fallback={
              <>
                <NewFriendItem />
                <For each={friends()}>{(item) => <FriendItem item={item} />}</For>
              </>
            }
          >
            <For each={searchedFriends()}>{(item) => <FriendItem item={item} />}</For>
          </Show>
        </ul>
      </div>
    </div>
  );
};

export default Friends;
