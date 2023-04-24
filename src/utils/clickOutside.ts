import { Accessor, JSX, onCleanup } from "solid-js";

export default function clickOutside(el: HTMLElement, accessor: Accessor<Accessor<void>>) {
  const onClick: JSX.EventHandler<HTMLElement, Event> = (ev) => !el.contains(ev.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      clickOutside: Accessor<void>;
    }
  }
}
