import { Component, createEffect, createMemo, For, JSX, on, Show } from "solid-js";
import { useHomeContext } from "@/pages/Home/HomeContext";
import clickOutside from "@/utils/clickOutside";
import { EmojiPicker } from "../common";
import { ClipOutline, SmileOutline, SendSolid, SpinProgress } from "../icons";
import { useSendMessage, useSendFile } from "./messages.service";
import MessageItem from "./MessageItem";
false && clickOutside;

const Messages: Component = () => {
  const [homeState] = useHomeContext();
  const messages = createMemo(() => {
    const room = homeState.rooms.find((r) => r.id === homeState.currRoom);
    return room.messages;
  });

  const { content, setContent, handleSendMsg } = useSendMessage();
  const handlePickEmoji = (emoji: string) => setContent((v) => v + emoji);
  createEffect(
    on(
      () => homeState.currRoom,
      () => setContent("")
    )
  );

  let divRef: HTMLDivElement | undefined;
  const scrollToBottom = () => {
    if (divRef) divRef.scrollTo(0, divRef.scrollHeight);
  };
  createEffect(on([() => messages().length, () => homeState.currPage], () => scrollToBottom()));

  let inputRef: HTMLInputElement | undefined;
  const { percentage, handleSendFile } = useSendFile();
  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = async (ev) => {
    const file = ev.currentTarget.files[0];
    if (!file) return;
    await handleSendFile(file);
    if (inputRef) inputRef.value = "";
  };

  return (
    <>
      <div ref={divRef} class="hover:scrollbar no-scrollbar flex grow flex-col space-y-5 overflow-y-scroll overflow-x-hidden p-3">
        <For each={messages()}>{(item) => <MessageItem item={item} />}</For>
      </div>
      <div class="relative flex h-16 items-center justify-center border-t px-4">
        <Show when={percentage() > 0}>
          <div class="absolute left-5 -top-12 inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full">
            <SpinProgress class="h-10 w-10" percent={percentage()} />
            <span class="absolute text-sm text-sky-600">{percentage()}</span>
          </div>
        </Show>
        <label for="send-file" class="mx-2 cursor-pointer rounded-full p-1 text-gray-400 hover:text-sky-600 active:text-gray-400">
          <ClipOutline class="h-5 w-5" />
          <input disabled={percentage() > 0} ref={inputRef} onChange={handleChange} id="send-file" type="file" class="hidden" />
        </label>

        <input
          type="text"
          spellcheck={false}
          value={content()}
          onInput={(ev) => setContent(ev.currentTarget.value)}
          onKeyUp={(ev) => ev.key === "Enter" && handleSendMsg()}
          class="w-full rounded-md border-gray-200 bg-white py-1.5 text-gray-700 placeholder:text-gray-400 focus:border-sky-600 focus:ring-sky-600"
          placeholder="Type your message here..."
        />
        <div class="mx-3 flex items-center space-x-3">
          <EmojiPicker onPickEmoji={handlePickEmoji} class="absolute -left-72 -top-52">
            <div class="cursor-pointer rounded-full p-1 text-gray-400 hover:text-sky-600 active:text-gray-400">
              <SmileOutline class="h-6 w-6" />
            </div>
          </EmojiPicker>

          <div onClick={handleSendMsg} class="cursor-pointer rounded-full bg-sky-700 p-2 hover:bg-sky-600 active:bg-sky-700">
            <SendSolid class="h-5 w-5 -rotate-45 fill-white" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
