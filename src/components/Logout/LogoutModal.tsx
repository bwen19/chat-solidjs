import { ParentComponent, createSignal } from "solid-js";
import { Modal } from "@/components/common";
import { PowerOutline } from "@/components/icons";
import clickOutside from "@/utils/clickOutside";
import { useLogout } from "./useLogout";
false && clickOutside;

export const LogoutModal: ParentComponent = (props) => {
  const { loading, handleLogout } = useLogout();
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <div onClick={[setOpen, true]}>{props.children}</div>
      <Modal open={open()}>
        <div use:clickOutside={() => setOpen(false)} class="w-96 rounded-md bg-white">
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
                onClick={[setOpen, false]}
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
    </>
  );
};
