import { Component, For, ParentComponent, Show, createSignal } from "solid-js";
import emojiData from "./emoji-data.json";
import clickOutside from "@/utils/clickOutside";
false && clickOutside;

const EmojiItem: Component<{ emoji: string; onClick: (emoji: string) => void }> = (props) => {
  return (
    <button onClick={[props.onClick, props.emoji]} class="m-0.5 cursor-default rounded-md text-xl hover:bg-sky-200">
      {props.emoji}
    </button>
  );
};

const EmojiCategory: Component<{ category: string; onClick: (emoji: string) => void }> = (props) => {
  return (
    <div class="flex flex-col">
      <span class="mb-1 text-sm font-semibold text-gray-400">{props.category}</span>
      <div class="flex flex-wrap">
        <For each={Object.values(emojiData[props.category]) as []}>{(item) => <EmojiItem emoji={item} onClick={props.onClick} />}</For>
      </div>
    </div>
  );
};

const EmojiPicker: ParentComponent<{ onPickEmoji: (emoji: string) => void; class: string }> = (props) => {
  const [open, setOpen] = createSignal(false);
  const handleClick = (emoji: string) => {
    props.onPickEmoji(emoji);
    setOpen(false);
  };

  return (
    <div use:clickOutside={() => setOpen(false)} class="relative">
      <div onClick={() => setOpen((v) => !v)}>{props.children}</div>
      <Show when={open()}>
        <div class={`hover:scrollbar no-scrollbar flex h-48 w-80 flex-col space-y-2 overflow-y-scroll rounded-md bg-white p-4 shadow-lg ${props.class}`}>
          <For each={Object.keys(emojiData)}>{(item) => <EmojiCategory category={item} onClick={handleClick} />}</For>
        </div>
      </Show>
    </div>
  );
};

export default EmojiPicker;
