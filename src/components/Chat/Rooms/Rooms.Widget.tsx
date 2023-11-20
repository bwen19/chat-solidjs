import { Accessor, createSignal, For, ParentComponent, Show } from "solid-js";
import { Modal } from "@/components/common";
import { UserItem } from "../Chat.Widget";
import { useNewRoom } from "./rooms.service";

// ========================// NewRoomModal //======================== //

export const NewRoomModalWrapper: ParentComponent = (props) => {
  const [open, setOpen] = createSignal(false);

  return (
    <div onClick={[setOpen, true]}>
      {props.children}
      <Show when={open()}>
        <NewRoomModal onClose={() => setOpen(false)} />
      </Show>
    </div>
  );
};

const NewRoomModal: ParentComponent<{ onClose: Accessor<void> }> = (props) => {
  const { newRoom, toggleSelection, setName, createRoom } = useNewRoom();

  const handleCreateRoom = async () => {
    await createRoom();
    props.onClose();
  };

  return (
    <Modal onClose={props.onClose}>
      <div class="overflow-hidden rounded-md bg-white">
        <div class="border-b px-5 py-3">
          <h3 class="text-lg">Create new room</h3>
        </div>
        <div class="flex h-full max-h-64 space-x-7 p-7">
          <div class="space-y-2">
            <p class="text-gray-500">
              已选择: <span>{newRoom.total}</span>人
            </p>
            <ul class="hover:scrollbar no-scrollbar mx-auto w-56 overflow-y-scroll rounded-md border py-2">
              <For each={newRoom.candidates}>{(item) => <UserItem item={item} handleSelection={toggleSelection} />}</For>
            </ul>
          </div>
          <div class="w-44">
            <div class="space-y-2">
              <label for="room-name" class="text-gray-500">
                Name:
              </label>
              <input
                id="room-name"
                type="text"
                placeholder="New room name"
                onInput={(ev) => setName(ev.currentTarget.value)}
                class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>
          </div>
        </div>

        <div class="space-x-4 bg-gray-100 px-7 py-3 text-right">
          <button onClick={props.onClose} type="button" class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleCreateRoom}
            type="button"
            class="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 active:bg-sky-600"
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
};
