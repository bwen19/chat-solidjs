import { Accessor, ParentComponent, Show, createSignal } from "solid-js";
import { useLogout } from "@/utils/useAuthFetch";
import { Modal, PowerOutline } from "../common";

export const LogoutModalWrapper: ParentComponent = (props) => {
  const [open, setOpen] = createSignal(false);

  return (
    <div onClick={[setOpen, true]}>
      {props.children}
      <Show when={open()}>
        <LogoutModal onClose={() => setOpen(false)} />
      </Show>
    </div>
  );
};

export const LogoutModal: ParentComponent<{ onClose: Accessor<void> }> = (props) => {
  const { loading, handleLogout } = useLogout();

  return (
    <Modal onClose={props.onClose}>
      <div class="w-96 rounded-md bg-white">
        <div class="flex flex-col items-center space-y-8 py-8">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-orange-200">
            <PowerOutline class="h-10 w-10 text-orange-600" />
          </div>
          <div>
            <h3 class="text-center text-xl font-semibold">Hope to see you back soon</h3>
            <p class="mt-3 text-center text-gray-500">Are you sure you want to logout?</p>
          </div>
          <div class="flex justify-end space-x-6">
            <button
              type="button"
              disabled={loading()}
              onClick={props.onClose}
              class="inline-flex justify-center rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading()}
              onClick={handleLogout}
              class="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
