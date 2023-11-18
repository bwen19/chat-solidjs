import { createSignal } from "solid-js";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { ClientEvent, SendFileConfig } from "@/api";
import { useUpload } from "@/utils/upload";

export const useSendMessage = () => {
  const [homeState, { sendMessage }] = useHomeContext();
  const [content, setContent] = createSignal("");

  const handleSendMsg = () => {
    if (content()) {
      const evt: ClientEvent = {
        action: "new-message",
        data: {
          roomId: homeState.currRoom,
          content: content(),
          kind: "text",
        },
      };
      sendMessage(evt);
      setContent("");
    }
  };

  return { content, setContent, handleSendMsg };
};

export const useSendFile = () => {
  const [homeState, { sendMessage }] = useHomeContext();
  const { percentage, uploadFile } = useUpload(SendFileConfig);

  const handleSendFile = async (file: File) => {
    try {
      const { fileUrl } = await uploadFile(file);
      const evt: ClientEvent = {
        action: "new-message",
        data: {
          roomId: homeState.currRoom,
          content: `${fileUrl} ${file.name}`,
          kind: "file",
        },
      };
      sendMessage(evt);
    } catch (err) {
      console.error(err);
    }
  };

  return { percentage, handleSendFile };
};
