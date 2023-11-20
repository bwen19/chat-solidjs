import { Accessor, Component, ParentComponent, Show, createSignal } from "solid-js";
import { Avatar, Modal, UploadOutline } from "../common";
import { RoomInfo } from "@/api";
import { useChangeCover, useUpdateRoom } from "./chat.service";

// ========================// UserItem //======================== //

export type UserCandidate = {
  id: number;
  name: string;
  avatar: string;
  selected: boolean;
  fixed: boolean;
};

type UserItemProps = {
  item: UserCandidate;
  handleSelection: (id: number) => void;
};

export const UserItem: Component<UserItemProps> = (props) => {
  return (
    <li class="cursor-default px-4 py-2 hover:bg-gray-100">
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

export const UpdateRoomModalWrapper: ParentComponent<{ room: RoomInfo }> = (props) => {
  const [open, setOpen] = createSignal(false);

  return (
    <div onClick={[setOpen, true]}>
      {props.children}
      <Show when={open()}>
        <UpdateRoomModal room={props.room} onClose={() => setOpen(false)} />
      </Show>
    </div>
  );
};

const UpdateRoomModal: Component<{ room: RoomInfo; onClose: Accessor<void> }> = (props) => {
  const handleChangeCover = useChangeCover(props.room.id);
  const { loading, setFields, handleUpdateRoom } = useUpdateRoom();

  return (
    <Modal onClose={props.onClose}>
      <div class="w-96 overflow-hidden rounded-md bg-white">
        <div class="border-b py-3 pl-6">
          <h3 class="text-xl">Room profile</h3>
        </div>
        <div class="my-4 flex flex-col items-center">
          <label for="cover-file" class="group relative h-24 w-24 overflow-hidden rounded-full hover:cursor-pointer">
            <Avatar src={props.room.cover} class="h-24 w-24 rounded-full" />
            <div class="absolute inset-0 hidden bg-gray-700 bg-opacity-70 transition-opacity group-hover:block">
              <div class="flex h-full w-full flex-col items-center justify-center space-y-2">
                <UploadOutline class="h-6 w-6 text-white" />
                <p class="text-sm font-semibold text-white">修改图片</p>
              </div>
            </div>
            <input onChange={handleChangeCover} id="cover-file" type="file" class="hidden" />
          </label>
          <p class="mt-2 text-center">{props.room.name}</p>
        </div>
        <form onSubmit={handleUpdateRoom(props.onClose)} spellcheck={false}>
          <div class="space-y-2 px-8 pb-5">
            <label for="name" class="text-gray-500">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder={props.room.name}
              disabled={loading()}
              onInput={(ev) => setFields("name", ev.currentTarget.value)}
              class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
            />
          </div>

          <div class="space-x-4 bg-gray-100 px-8 py-3 text-right">
            <button onClick={props.onClose} type="button" class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-200">
              Cancel
            </button>
            <button disabled={loading()} type="submit" class="rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
