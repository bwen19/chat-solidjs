import { Accessor, Component, Match, ParentComponent, Show, Switch } from "solid-js";
import { MessageInfo } from "@/api";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { fmtDividerDate } from "@/utils/time";
import { Avatar, DownloadOutline } from "@/components/common";

// ========================// MessageItem //======================== //

const MessageItem: Component<{ item: MessageInfo; onImageLoad: Accessor<void> }> = (props) => {
  const [homeState] = useHomeContext();
  return (
    <>
      <Show when={props.item.divide}>
        <div class="text-center">
          <span class="text-xs text-gray-400">{fmtDividerDate(props.item.sendAt)}</span>
        </div>
      </Show>
      <Switch fallback={<MessageText item={props.item} />}>
        <Match when={props.item.kind === "image"}>
          <MessageImage item={props.item} onImageLoad={props.onImageLoad} />
        </Match>
        <Match when={props.item.kind === "file"}>
          <MessageFile item={props.item} />
        </Match>
      </Switch>
    </>
  );
};

export default MessageItem;

// ========================// Message //======================== //

type MessageItemProps = {
  avatar: string;
  name: string;
  sendAt: Date;
};

const SenderMessage: ParentComponent<MessageItemProps> = (props) => {
  return (
    <div class="flex">
      <div class="flex items-start space-x-2">
        <Avatar src={props.avatar} class="h-8 w-8 shrink-0 rounded-full" />
        <div class="grow">
          <p class="mb-2 w-fit text-sm font-semibold text-gray-700">{props.name}</p>
          {props.children}
        </div>
      </div>
    </div>
  );
};

const ReceiverMessage: ParentComponent<MessageItemProps> = (props) => {
  return (
    <div class="flex flex-row-reverse">
      <div class="flex flex-row-reverse items-start space-x-2 space-x-reverse">
        <Avatar src={props.avatar} class="h-8 w-8 shrink-0 rounded-full" />
        <div class="flex grow flex-col items-end">
          <p class="mb-2 w-fit text-sm font-semibold text-gray-700">{props.name}</p>
          {props.children}
        </div>
      </div>
    </div>
  );
};

// ========================// MessageText //======================== //

const MessageText: Component<{ item: MessageInfo }> = (props) => {
  const [state] = useAppContext();

  return (
    <Show
      when={state.user.id === props.item.senderId}
      fallback={
        <SenderMessage avatar={props.item.avatar} name={props.item.name} sendAt={props.item.sendAt}>
          <div class="w-fit max-w-lg break-all rounded-b-lg rounded-tr-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">{props.item.content}</div>
        </SenderMessage>
      }
    >
      <ReceiverMessage avatar={props.item.avatar} name={props.item.name} sendAt={props.item.sendAt}>
        <div class="w-fit max-w-lg break-all rounded-b-lg rounded-tl-lg bg-sky-500 px-3 py-2 text-sm text-white shadow-md">{props.item.content}</div>
      </ReceiverMessage>
    </Show>
  );
};

// ========================// MessageImage //======================== //

const MessageImage: Component<{ item: MessageInfo; onImageLoad: Accessor<void> }> = (props) => {
  const [state] = useAppContext();

  return (
    <Show
      when={state.user.id === props.item.senderId}
      fallback={
        <SenderMessage avatar={props.item.avatar} name={props.item.name} sendAt={props.item.sendAt}>
          <div class="max-w-72">
            <img src={props.item.fileUrl} alt={props.item.content} class="object-cover object-center" onLoad={props.onImageLoad} />
          </div>
        </SenderMessage>
      }
    >
      <ReceiverMessage avatar={props.item.avatar} name={props.item.name} sendAt={props.item.sendAt}>
        <div class="max-w-72">
          <img src={props.item.fileUrl} alt={props.item.content} class="object-cover object-center" onLoad={props.onImageLoad} />
        </div>
      </ReceiverMessage>
    </Show>
  );
};

// ========================// MessageFile //======================== //

const MessageFile: Component<{ item: MessageInfo }> = (props) => {
  const [state] = useAppContext();

  return (
    <Show
      when={state.user.id === props.item.senderId}
      fallback={
        <SenderMessage avatar={props.item.avatar} name={props.item.name} sendAt={props.item.sendAt}>
          <div class="w-fit rounded-b-lg rounded-tr-lg bg-white px-3 py-2">
            <a href={props.item.fileUrl} download={props.item.content} class="space-x-2">
              <DownloadOutline class="inline-block h-5 w-5 text-sky-600" />
              <span class="text-sm text-gray-500 hover:text-sky-600">{props.item.content}</span>
            </a>
          </div>
        </SenderMessage>
      }
    >
      <ReceiverMessage avatar={props.item.avatar} name={props.item.name} sendAt={props.item.sendAt}>
        <div class="w-fit rounded-b-lg rounded-tl-lg bg-white px-3 py-2">
          <a href={props.item.fileUrl} download={props.item.content} class="space-x-2">
            <DownloadOutline class="inline-block h-5 w-5 text-sky-600" />
            <span class="text-sm text-gray-500 hover:text-sky-600">{props.item.content}</span>
          </a>
        </div>
      </ReceiverMessage>
    </Show>
  );
};
