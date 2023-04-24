import { ParentComponent, Show } from "solid-js";
import { Portal } from "solid-js/web";

const Modal: ParentComponent<{ open: boolean }> = (props) => {
  return (
    <Show when={props.open}>
      <Portal mount={document.getElementById("root")}>
        <div class="fixed inset-0 z-20 bg-gray-500 bg-opacity-30 transition-opacity">
          <div class="flex min-h-full items-center justify-center p-5">{props.children}</div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;
