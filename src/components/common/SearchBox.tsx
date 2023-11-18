import { Component, createEffect, createSignal, JSX, Setter } from "solid-js";
import { CloseOutline, SearchOutline } from "./icons";

const SearchBox: Component<{ onSearch: (keyword: string) => void; setSearching: Setter<boolean>; placeholder?: string }> = (props) => {
  const [key, setKey] = createSignal("");

  createEffect(() => {
    if (!key()) props.setSearching(false);
  });

  const handleEnter: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (ev) => {
    if (key() && ev.key === "Enter") {
      props.setSearching(true);
      props.onSearch(key());
    }
  };

  return (
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center justify-center">
        <SearchOutline class="h-4 w-4 text-gray-500" />
      </div>
      <input
        type="text"
        spellcheck={false}
        value={key()}
        onKeyUp={handleEnter}
        onInput={(ev) => setKey(ev.currentTarget.value)}
        class="w-full rounded-lg border-gray-200 px-8 text-sm leading-tight text-gray-800 placeholder:text-gray-400 focus:border-sky-600 focus:ring-sky-600"
        placeholder={props.placeholder || ""}
      />
      <div onClick={() => setKey("")} class="absolute inset-y-0 right-0 flex w-8 cursor-pointer items-center justify-center" classList={{ invisible: !key() }}>
        <CloseOutline class="h-4 w-4 text-gray-700" />
      </div>
    </div>
  );
};

export default SearchBox;
