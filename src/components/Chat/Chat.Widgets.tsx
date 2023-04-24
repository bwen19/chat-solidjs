import { Component, createSignal, For, ParentComponent, Show } from "solid-js";
import { Avatar, Modal } from "../common";
import clickOutside from "@/utils/clickOutside";
import { useNewRoom, UserCandidate } from "./rooms.service";
import { useAddMembers, useDeleteMembers } from "./members.service";
import { SwitchOutline } from "../icons";
false && clickOutside;

// ========================// UserItem //======================== //

type UserItemProps = {
  item: UserCandidate;
  handleSelection: (id: number) => void;
};

const UserItem: Component<UserItemProps> = (props) => {
  return (
    <li class="cursor-default py-2 px-4 hover:bg-gray-100">
      <label for={`check-${props.item.id}`} class="flex w-full items-center space-x-3">
        <input
          id={`check-${props.item.id}`}
          type="checkbox"
          disabled={props.item.fixed}
          checked={props.item.selected}
          onChange={[props.handleSelection, props.item.id]}
          class="h-4 w-4 rounded"
          classList={{ "text-sky-600 focus:ring-0": !props.item.fixed, "text-gray-400": props.item.fixed }}
        />
        <Avatar src={props.item.avatar} class="h-8 w-8 rounded-full" />
        <p class="truncate text-sm font-semibold">{props.item.name}</p>
      </label>
    </li>
  );
};

// ========================// NewRoomModal //======================== //

export const NewRoomModal: ParentComponent = (props) => {
  const { newRoom, toggleSelection, setName, createRoom } = useNewRoom();
  const [open, setOpen] = createSignal(false);

  const handleCreateRoom = async () => {
    await createRoom();
    setOpen(false);
  };

  return (
    <>
      <div onClick={[setOpen, true]}>{props.children}</div>
      <Modal open={open()}>
        <div use:clickOutside={() => setOpen(false)} class="overflow-hidden rounded-md bg-white">
          <div class="border-b py-3 px-5">
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
            <button
              onClick={[setOpen, false]}
              type="button"
              class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRoom}
              type="button"
              class="rounded-md bg-sky-600 py-2 px-4 text-sm font-semibold text-white hover:bg-sky-700 active:bg-sky-600"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// ========================// ModifyMemberModal //======================== //

export const ModifyMemberModal: ParentComponent = (props) => {
  const [showDel, setShowDel] = createSignal(false);
  const { newMembers, addSelection, addMembers } = useAddMembers();
  const { delMembers, delSelection, deleteMembers } = useDeleteMembers();

  const [open, setOpen] = createSignal(false);

  const handleAddMembers = async () => {
    await addMembers();
    setOpen(false);
  };

  const handleDeleteMembers = async () => {
    await deleteMembers();
    setOpen(false);
  };

  return (
    <>
      <div onClick={[setOpen, true]}>{props.children}</div>
      <Modal open={open()}>
        <div use:clickOutside={() => setOpen(false)} class="overflow-hidden rounded-md bg-white">
          <div class="flex items-center justify-between border-b py-3 px-5">
            <h3 class="text-lg">
              <Show when={showDel()} fallback={"Add Members"}>
                Delete Members
              </Show>
            </h3>
            <div onClick={() => setShowDel((v) => !v)} class="cursor-pointer rounded-full p-2 text-sky-600 hover:bg-gray-300 active:text-sky-500">
              <SwitchOutline class="h-5 w-5" />
            </div>
          </div>
          <div class="h-full max-h-64 px-12 py-7">
            <Show
              when={showDel()}
              fallback={
                <div class="space-y-2">
                  <p class="text-gray-500">
                    已选择: <span>{newMembers.total}</span>人
                  </p>
                  <ul class="hover:scrollbar no-scrollbar mx-auto w-56 overflow-y-scroll rounded-md border py-2">
                    <For each={newMembers.candidates}>{(item) => <UserItem item={item} handleSelection={addSelection} />}</For>
                  </ul>
                </div>
              }
            >
              <div class="space-y-2">
                <p class="text-gray-500">
                  已选择: <span>{delMembers.total}</span>人
                </p>
                <ul class="hover:scrollbar no-scrollbar mx-auto w-56 overflow-y-scroll rounded-md border py-2">
                  <For each={delMembers.candidates}>{(item) => <UserItem item={item} handleSelection={delSelection} />}</For>
                </ul>
              </div>
            </Show>
          </div>

          <div class="space-x-4 bg-gray-100 px-7 py-3 text-right">
            <button
              onClick={[setOpen, false]}
              type="button"
              class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-300"
            >
              Cancel
            </button>
            <Show
              when={showDel()}
              fallback={
                <button
                  onClick={handleAddMembers}
                  type="button"
                  class="rounded-md bg-sky-600 py-2 px-4 text-sm font-semibold text-white hover:bg-sky-700 active:bg-sky-600"
                >
                  Add
                </button>
              }
            >
              <button
                onClick={handleDeleteMembers}
                type="button"
                class="rounded-md bg-rose-600 py-2 px-4 text-sm font-semibold text-white hover:bg-rose-700 active:bg-rose-600"
              >
                Delete
              </button>
            </Show>
          </div>
        </div>
      </Modal>
    </>
  );
};
