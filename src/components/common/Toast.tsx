import { Component, createEffect, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useAppContext } from "@/AppContext";
import { CloseOutline, InfoOutline, WarnOutline } from "../icons";

const Toast: Component = () => {
  const [state, { setToast }] = useAppContext();

  const closeToast = () => setToast("", "error", false);
  createEffect(() => {
    if (state.toast.open) setTimeout(closeToast, 5000);
  });

  const color = () => (state.toast.kind === "success" ? "bg-green-700" : "bg-orange-600");

  return (
    <Portal mount={document.getElementById("root")}>
      <div class="fixed inset-x-0 top-8 z-30 text-center lg:top-16" classList={{ hidden: !state.toast.open }}>
        <div class={`inline-flex w-fit max-w-md space-x-4 rounded-md p-3 shadow-lg ${color()}`}>
          <div class="text-gray-50">
            <Show when={state.toast.kind === "success"} fallback={<WarnOutline class="h-5 w-5" />}>
              <InfoOutline class="h-5 w-5" />
            </Show>
          </div>
          <span class="text-sm text-white line-clamp-1">{state.toast.message}</span>
          <div onclick={closeToast} class="cursor-pointer text-gray-50 hover:text-gray-800">
            <CloseOutline class="h-5 w-5" />
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Toast;
