import { Component, Show } from "solid-js";
import { MessageInfo } from "@/api";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { fmtDividerDate, fmtSendTime } from "@/utils/time";
import { Avatar, DownloadOutline } from "../common";

// ========================// MessageText //======================== //

const MessageText: Component<{ item: MessageInfo }> = (props) => {
  const [state] = useAppContext();
  return (
    <Show
      when={state.user.id === props.item.senderId}
      fallback={
        <div class="flex">
          <div class="flex items-start space-x-2">
            <Avatar src={props.item.avatar} class="h-8 w-8 shrink-0 rounded-full" />
            <div class="grow">
              <p class="mb-2 w-fit text-sm font-semibold text-gray-700">
                {props.item.name}
                <span class="ml-2 text-xs text-gray-400">{fmtSendTime(props.item.sendAt)}</span>
              </p>
              <div class="w-fit max-w-lg break-all rounded-b-lg rounded-tr-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">{props.item.content}</div>
            </div>
          </div>
        </div>
      }
    >
      <div class="flex flex-row-reverse">
        <div class="flex flex-row-reverse items-start space-x-2 space-x-reverse">
          <Avatar src={props.item.avatar} class="h-8 w-8 shrink-0 rounded-full" />
          <div class="flex grow flex-col items-end">
            <p class="mb-2 w-fit text-sm font-semibold text-gray-700">
              <span class="mr-2 text-xs text-gray-400">{fmtSendTime(props.item.sendAt)}</span>
              {props.item.name}
            </p>
            <div class="w-fit max-w-lg break-all rounded-b-lg rounded-tl-lg bg-sky-500 px-3 py-2 text-sm text-white shadow-md">{props.item.content}</div>
          </div>
        </div>
      </div>
    </Show>
  );
};

// ========================// MessageFile //======================== //

const MessageFile: Component<{ item: MessageInfo }> = (props) => {
  const [state] = useAppContext();
  const [fileUrl, fileName, _] = props.item.content.split(" ");
  if (!fileUrl || !fileName) return null;

  return (
    <Show
      when={state.user.id === props.item.senderId}
      fallback={
        <div class="flex">
          <div class="flex w-5/6 items-start space-x-2">
            <Avatar src={props.item.avatar} class="h-8 w-8 shrink-0 rounded-full" />
            <div class="grow">
              <p class="mb-2 w-fit text-sm font-semibold text-gray-700">
                {props.item.name}
                <span class="ml-2 text-xs text-gray-400">{fmtSendTime(props.item.sendAt)}</span>
              </p>
              <div class="w-fit rounded-b-lg rounded-tr-lg bg-white px-3 py-2">
                <a href={fileUrl} download={fileName} class="space-x-2">
                  <DownloadOutline class="inline-block h-5 w-5 text-sky-600" />
                  <span class="text-sm text-gray-500 hover:text-sky-600">{fileName}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div class="flex flex-row-reverse">
        <div class="flex w-5/6 flex-row-reverse items-start space-x-2 space-x-reverse">
          <Avatar src={props.item.avatar} class="h-8 w-8 shrink-0 rounded-full" />
          <div class="flex grow flex-col items-end">
            <p class="mb-2 w-fit text-sm font-semibold text-gray-700">
              <span class="mr-2 text-xs text-gray-400">{fmtSendTime(props.item.sendAt)}</span>
              {props.item.name}
            </p>
            <div class="w-fit rounded-b-lg rounded-tl-lg bg-white px-3 py-2">
              <a href={fileUrl} download={fileName} class="space-x-2">
                <DownloadOutline class="inline-block h-5 w-5 text-sky-600" />
                <span class="text-sm text-gray-500 hover:text-sky-600">{fileName}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

// ========================// MessageItem //======================== //

const MessageItem: Component<{ item: MessageInfo }> = (props) => {
  const [homeState] = useHomeContext();
  return (
    <>
      <Show when={props.item.divide}>
        <div class="text-center">
          <span class="text-xs text-gray-400">{fmtDividerDate(props.item.sendAt, homeState.today)}</span>
        </div>
      </Show>
      <Show when={props.item.kind === "text"} fallback={<MessageFile item={props.item} />}>
        <MessageText item={props.item} />
      </Show>
    </>
  );
};

export default MessageItem;
