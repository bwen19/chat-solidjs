import { createSignal } from "solid-js";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { NewMessageRequest, SendFileConfig } from "@/api";
import { useUpload } from "@/utils/upload";

export const useSendMessage = () => {
  const [homeState, { sendMessage }] = useHomeContext();
  const [content, setContent] = createSignal("");

  const handleSendMsg = () => {
    if (content()) {
      const message: NewMessageRequest = {
        SendMessage: {
          room_id: homeState.currRoom,
          content: content(),
          kind: "text",
        },
      };
      sendMessage(message);
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
      const { file_url } = await uploadFile(file);
      const message: NewMessageRequest = {
        SendMessage: {
          room_id: homeState.currRoom,
          content: `${file_url} ${file.name}`,
          kind: "file",
        },
      };
      sendMessage(message);
    } catch (err) {
      console.error(err);
    }
  };

  return { percentage, handleSendFile };
};
