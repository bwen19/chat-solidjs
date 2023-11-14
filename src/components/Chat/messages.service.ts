import { createSignal } from "solid-js";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { NewMessageRequest, SendFileConfig } from "@/api";
import { useUpload } from "@/utils/upload";

export const useSendMessage = () => {
  const [homeState, { sendMessage }] = useHomeContext();
  const [content, setContent] = createSignal("");

  const handleSendMsg = () => {
    if (content()) {
      const req: NewMessageRequest = {
        room_id: homeState.currRoom,
        content: content(),
        kind: "text",
      };
      sendMessage("new-message", req);
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
      const req: NewMessageRequest = {
        room_id: homeState.currRoom,
        content: `${file_url} ${file.name}`,
        kind: "file",
      };
      sendMessage("new-message", req);
    } catch (err) {
      console.error(err);
    }
  };

  return { percentage, handleSendFile };
};
