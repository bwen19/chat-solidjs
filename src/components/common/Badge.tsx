import { ParentComponent, Show } from "solid-js";

const Badge: ParentComponent<{ num: number }> = (props) => {
  return (
    <div class="relative">
      {props.children}
      <Show when={props.num > 0}>
        <span class="absolute -top-2 left-4 rounded-full bg-rose-500 p-0.5 px-1.5 text-xs text-white">{props?.num}</span>
      </Show>
    </div>
  );
};

export default Badge;
