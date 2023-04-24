import { Component, createMemo, For, Show } from "solid-js";
import { FriendInfo } from "@/api";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { Avatar } from "../common";
import { AcceptOutline, RefuseOutline } from "../icons";
import { useFriend } from "./friend.service";

const IncomingFriend: Component<{ friend: FriendInfo }> = (props) => {
  const { handleAcceptFriend, handleRefuseFriend } = useFriend();
  return (
    <li class="group flex cursor-default items-center space-x-3 rounded-md p-2 shadow-sm shadow-gray-400">
      <Avatar src={props.friend.avatar} class="h-8 w-8 shrink-0 rounded-full" />
      <span class="truncate text-sm font-semibold text-gray-600">{props.friend.username}</span>
      <span class="grow truncate text-sm text-gray-500">{props.friend.nickname}</span>
      <div onClick={[handleRefuseFriend, props.friend.id]} class="cursor-pointer p-1 text-rose-600 hover:text-rose-500">
        <RefuseOutline class="h-5 w-5" />
      </div>
      <div onClick={[handleAcceptFriend, props.friend.id]} class="cursor-pointer p-1 text-sky-700 hover:text-sky-600">
        <AcceptOutline class="h-5 w-5" />
      </div>
    </li>
  );
};

const OutgoingFriend: Component<{ friend: FriendInfo }> = (props) => {
  return (
    <li class="group flex cursor-default items-center space-x-3 rounded-md p-2 shadow-sm shadow-gray-400">
      <Avatar src={props.friend.avatar} class="h-8 w-8 shrink-0 rounded-full" />
      <span class="truncate text-sm font-semibold text-gray-600">{props.friend.username}</span>
      <span class="grow truncate text-sm text-gray-500">{props.friend.nickname}</span>
      <div class="p-1 text-sm text-gray-400">Adding</div>
    </li>
  );
};

const NewFriend: Component = () => {
  const [homeState] = useHomeContext();

  const incomingFriends = createMemo(() => homeState.friends.filter((f) => f.status === "adding" && !f.first));
  const outgoingFriends = createMemo(() => homeState.friends.filter((f) => f.status === "adding" && f.first));

  return (
    <div class="h-full grow bg-gray-100">
      <div class="flex h-14 shrink-0 items-center justify-center border-b">
        <p class="font-semibold text-gray-600">New Friend</p>
      </div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="hover:scrollbar no-scrollbar overflow-y-scroll p-3">
          <p class="font-semibold text-gray-500">Incoming:</p>
          <Show when={incomingFriends().length > 0} fallback={<p class="mt-5 text-center text-gray-400">No new friend.</p>}>
            <ul class="my-2 mx-2 space-y-2">
              <For each={incomingFriends()}>{(item) => <IncomingFriend friend={item} />}</For>
            </ul>
          </Show>
        </div>
        <div class="hover:scrollbar no-scrollbar overflow-y-scroll p-3">
          <p class="font-semibold text-gray-500">Outgoing:</p>
          <Show when={outgoingFriends().length > 0} fallback={<p class="mt-5 text-center text-gray-400">No request has been sent yet.</p>}>
            <ul class="my-2 mx-2 space-y-2">
              <For each={outgoingFriends()}>{(item) => <OutgoingFriend friend={item} />}</For>
            </ul>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default NewFriend;
