import { Accessor, createSignal, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { ChangeCoverConfig, ClientEvent } from "@/api";
import useUpload from "@/utils/useUpload";

export const useChangeCover = (roomId: number) => {
  const [_, { setToast }] = useAppContext();
  const uploadCover = useUpload(ChangeCoverConfig);

  const handleChangeAvatar: JSX.EventHandler<HTMLInputElement, Event> = async (ev) => {
    const coverFile = ev.currentTarget.files[0];
    if (!coverFile) return;

    if (!coverFile.type.startsWith("image") || coverFile.size > 1048576) {
      setToast("封面必须为小于1M的图片", "error");
      return;
    }

    await uploadCover(coverFile, roomId);
  };

  return handleChangeAvatar;
};

export const useUpdateRoom = () => {
  const [homeState, { sendMessage }] = useHomeContext();

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({ name: "" });

  const handleUpdateRoom =
    (onClose: Accessor<void>): JSX.EventHandler<HTMLFormElement, Event> =>
    async (ev) => {
      ev.preventDefault();
      if (fields.name) {
        setLoading(true);
        try {
          const evt: ClientEvent = { action: "update-room", data: { roomId: homeState.currRoom, name: fields.name } };
          sendMessage(evt);
          onClose();
        } catch (err) {}
        setLoading(false);
      } else {
        onClose();
      }
    };

  return { loading, setFields, handleUpdateRoom };
};
