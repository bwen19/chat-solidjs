import { Component, createMemo, Match, Switch } from "solid-js";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { Avatar, Confirm } from "../common";
import { FriendOutline } from "../icons";
import Friends from "./Friends";
import NewFriend from "./NewFriend";
import { useFriend } from "./friend.service";

const FriendPage: Component = () => {
  const [homeState, { navRoom }] = useHomeContext();
  const { handleDeleteFriend } = useFriend();

  const friend = createMemo(() => homeState.friends.find((x) => x.id === homeState.currFriend));

  return (
    <div class="flex h-full">
      <div class="h-full w-64 shrink-0 border-r bg-gray-200">
        <Friends />
      </div>
      <Switch
        fallback={
          <div class="flex h-full grow items-center justify-center bg-gray-100 py-1">
            <FriendOutline class="h-24 w-24 text-gray-300" />
          </div>
        }
      >
        <Match when={homeState.currFriend === -1}>
          <NewFriend />
        </Match>
        <Match when={friend()}>
          <div class="h-full grow bg-gray-100">
            <div class="flex h-14 shrink-0 items-center justify-center border-b px-4">
              <p class="font-semibold text-gray-600">Information</p>
            </div>
            <div class="m-8 overflow-hidden rounded-md bg-white">
              <div class="relative h-36 bg-gradient-to-r from-orange-300 to-sky-300">
                <div class="absolute inset-x-0 -bottom-12 ">
                  <Avatar class="mx-auto h-24 w-24 rounded-full ring-4 ring-white" src={friend().avatar} />
                </div>
              </div>
              <div class="pb-8 pt-14 text-center">
                <p class="text-lg font-semibold text-gray-700">{friend().username}</p>
                <p class="text-gray-400">{friend().nickname}</p>
                <p class="text-gray-400">{friend().bio}</p>
                <div class="mt-6 flex justify-center">
                  <Confirm onConfirm={() => handleDeleteFriend(homeState.currFriend)}>
                    <div class="cursor-pointer rounded-md px-4 py-1.5 text-rose-500 ring-1 ring-rose-500 hover:bg-rose-500 hover:text-white active:bg-rose-400">
                      Delete
                    </div>
                  </Confirm>
                  <button
                    onClick={() => navRoom(friend().room_id)}
                    type="button"
                    class="ml-6 rounded-md border bg-sky-700 px-6 py-1.5 text-white hover:bg-sky-600"
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default FriendPage;
