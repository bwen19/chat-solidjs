import { Accessor, ParentComponent, Show, createSignal } from "solid-js";
import { WarnOutline } from "./icons";
import Modal from "./Modal";

const Confirm: ParentComponent<{ onConfirm: Accessor<void> }> = (props) => {
  const [open, setOpen] = createSignal(false);
  const onClose = () => setOpen(false);

  const handleConfirm = () => {
    props.onConfirm();
    onClose();
  };

  return (
    <div onClick={[setOpen, true]}>
      {props.children}
      <Show when={open()}>
        <Modal onClose={onClose}>
          <div class="flex w-80 flex-col items-center space-y-8 rounded-md bg-white py-10">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-rose-200">
              <WarnOutline class="h-8 w-8 text-rose-600" />
            </div>
            <h4 class="text-center text-xl font-semibold text-gray-700">Are you sure?</h4>
            <div class="mt-3 flex justify-end px-2">
              <button
                type="button"
                onClick={handleConfirm}
                class="text-md mr-6 inline-flex justify-center rounded-md bg-rose-600 px-6 py-1.5 text-white shadow-sm hover:bg-rose-500"
              >
                Sure
              </button>
              <button
                type="button"
                onClick={onClose}
                class="text-md inline-flex justify-center rounded-md bg-white px-5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </Show>
    </div>
  );
};

export default Confirm;
