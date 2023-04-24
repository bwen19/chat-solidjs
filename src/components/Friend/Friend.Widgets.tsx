import { ParentComponent, Show, createSignal } from "solid-js";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import clickOutside from "@/utils/clickOutside";
import { useFriend, useFindUser } from "./friend.service";
import { Avatar, Modal, SearchBox } from "../common";
import { UserAddOutline } from "../icons";
false && clickOutside;

export const AddFriendModal: ParentComponent = (props) => {
  const [state] = useAppContext();
  const [homeState] = useHomeContext();
  const [open, setOpen] = createSignal(false);

  const { handleAddFriend } = useFriend();
  const { searched, handleSearch } = useFindUser();
  const [searching, setSearching] = createSignal(false);

  const isStranger = () => {
    if (searched() && searched().id !== state.user?.id) {
      const index = homeState.friends.findIndex((x) => x.id === searched().id);
      if (index === -1) return true;
    }
    return false;
  };

  return (
    <>
      <div onClick={[setOpen, true]}>{props.children}</div>
      <Modal open={open()}>
        <div use:clickOutside={() => setOpen(false)} class="w-96 overflow-hidden rounded-md bg-white">
          <div class="border-b py-3 pl-6">
            <h3 class="text-xl">Add new friend</h3>
          </div>
          <div class="px-8 pt-6 pb-8">
            <SearchBox onSearch={handleSearch} setSearching={setSearching} placeholder="Search user here" />
            <div class="mt-4 flex h-16 items-center justify-center">
              <Show when={searching()} fallback={<p class="text-center text-gray-400">Nothing to show here.</p>}>
                <Show when={searched()} fallback={<p class="text-center text-gray-400">No users found</p>}>
                  <div class="group flex grow cursor-default items-center space-x-3 rounded-md p-2 shadow-sm shadow-gray-400">
                    <Avatar src={searched().avatar} class="h-8 w-8 shrink-0 rounded-full" />
                    <span class="truncate text-sm font-semibold text-gray-600">{searched().username}</span>
                    <span class="grow truncate text-sm text-gray-500">{searched().nickname}</span>
                    <Show when={isStranger()} fallback={<div class="p-1 text-sm text-gray-500">Added</div>}>
                      <div onClick={[handleAddFriend, searched().id]} class="cursor-pointer p-1 text-sky-700 hover:text-sky-600 active:text-sky-700">
                        <UserAddOutline class="h-5 w-5" />
                      </div>
                    </Show>
                  </div>
                </Show>
              </Show>
            </div>
          </div>
          <div class="bg-gray-100 px-7 py-3 text-center">
            <button
              onClick={[setOpen, false]}
              type="button"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
