import { Component, Show, createEffect } from "solid-js";
import { useAppContext } from "@/AppContext";
import { Modal, WarnOutline } from "@/components/common";
import { useLogout } from "@/utils/useAuthFetch";
import { useHomeContext } from "./HomeContext";

export const DisconnectionModal: Component = () => {
  const [_, { signOut }] = useAppContext();
  const [homeState] = useHomeContext();
  const { handleLogout } = useLogout(false);

  createEffect(() => {
    if (homeState.disconnected) handleLogout();
  });

  return (
    <Show when={homeState.disconnected}>
      <Modal onClose={() => {}}>
        <div class="w-96 rounded-md bg-white">
          <div class="flex flex-col items-center space-y-8 py-8">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-rose-200">
              <WarnOutline class="h-8 w-8 text-rose-600" />
            </div>
            <div>
              <h3 class="text-center text-xl font-semibold">Disconnected</h3>
              <p class="mt-3 px-8 text-center text-gray-500">You have been disconnected from the server. Please login again.</p>
            </div>
            <div class="flex justify-end space-x-6">
              <button
                type="button"
                onClick={signOut}
                class="inline-flex justify-center rounded-md bg-rose-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </Show>
  );
};
