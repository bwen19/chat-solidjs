import { Accessor, ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";
import clickOutside from "@/utils/clickOutside";
false && clickOutside;

const Modal: ParentComponent<{ onClose: Accessor<void> }> = (props) => {
  return (
    <Portal mount={document.getElementById("root")}>
      <div class="fixed inset-0 z-20 bg-gray-500 bg-opacity-30 transition-opacity">
        <div class="flex min-h-full items-center justify-center p-5">
          <div use:clickOutside={props.onClose}>{props.children}</div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
