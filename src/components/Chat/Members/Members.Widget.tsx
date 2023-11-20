import { Accessor, createSignal, For, ParentComponent, Show } from "solid-js";
import { Modal, UserDelOutline, UserAddOutline } from "@/components/common";
import { UserItem } from "../Chat.Widget";
import { useAddMembers, useDeleteMembers } from "./members.service";

// ========================// ModifyMemberModal //======================== //

export const ModifyMemberModalWrapper: ParentComponent = (props) => {
  const [open, setOpen] = createSignal(false);

  return (
    <div onClick={[setOpen, true]}>
      {props.children}
      <Show when={open()}>
        <ModifyMemberModal onClose={() => setOpen(false)} />
      </Show>
    </div>
  );
};

const ModifyMemberModal: ParentComponent<{ onClose: Accessor<void> }> = (props) => {
  const [showAdd, setShowAdd] = createSignal(true);
  const { newMembers, addSelection, addMembers } = useAddMembers();
  const { delMembers, delSelection, deleteMembers } = useDeleteMembers();

  const handleAddMembers = () => {
    addMembers();
    props.onClose();
  };

  const handleDeleteMembers = () => {
    deleteMembers();
    props.onClose();
  };

  const DeleteMembers = (
    <>
      <div class="flex items-center justify-between border-b px-5 py-3">
        <h3 class="text-lg">Delete Members</h3>
        <div onClick={[setShowAdd, true]} class="cursor-pointer rounded-full p-2 text-sky-600 hover:bg-gray-300 active:text-sky-500">
          <UserAddOutline class="h-5 w-5" />
        </div>
      </div>

      <div class="h-full max-h-64 px-12 py-7">
        <div class="space-y-2">
          <p class="text-gray-500">
            已选择: <span>{delMembers.total}</span>人
          </p>
          <ul class="hover:scrollbar no-scrollbar mx-auto w-56 overflow-y-scroll rounded-md border py-2">
            <For each={delMembers.candidates}>{(item) => <UserItem item={item} handleSelection={delSelection} />}</For>
          </ul>
        </div>
      </div>

      <div class="space-x-4 bg-gray-100 px-7 py-3 text-right">
        <button onClick={props.onClose} type="button" class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-300">
          Cancel
        </button>
        <button
          onClick={handleDeleteMembers}
          type="button"
          class="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 active:bg-rose-600"
        >
          Delete
        </button>
      </div>
    </>
  );

  return (
    <Modal onClose={props.onClose}>
      <div class="overflow-hidden rounded-md bg-white">
        <Show when={showAdd()} fallback={DeleteMembers}>
          <div class="flex items-center justify-between border-b px-5 py-3">
            <h3 class="text-lg">Add Members</h3>
            <div onClick={[setShowAdd, false]} class="cursor-pointer rounded-full p-2 text-rose-700 hover:bg-gray-300 active:text-rose-600">
              <UserDelOutline class="h-5 w-5" />
            </div>
          </div>

          <div class="h-full max-h-64 px-12 py-7">
            <div class="space-y-2">
              <p class="text-gray-500">
                已选择: <span>{newMembers.total}</span>人
              </p>
              <ul class="hover:scrollbar no-scrollbar mx-auto w-56 overflow-y-scroll rounded-md border py-2">
                <For each={newMembers.candidates}>{(item) => <UserItem item={item} handleSelection={addSelection} />}</For>
              </ul>
            </div>
          </div>

          <div class="space-x-4 bg-gray-100 px-7 py-3 text-right">
            <button onClick={props.onClose} type="button" class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-300">
              Cancel
            </button>
            <button
              onClick={handleAddMembers}
              type="button"
              class="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 active:bg-sky-600"
            >
              Add
            </button>
          </div>
        </Show>
      </div>
    </Modal>
  );
};
