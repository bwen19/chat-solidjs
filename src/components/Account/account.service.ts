import { Accessor, createSignal, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { ChangeAvatarConfig, ChangePasswordConfig, UpdateUserConfig } from "@/api";
import { useAppContext } from "@/AppContext";
import { useFetchPrivate } from "@/utils/fetch";
import { useUpload } from "@/utils/upload";

export const useChangeAvatar = () => {
  const [state, { updateState, setToast }] = useAppContext();
  const { percentage, uploadFile } = useUpload(ChangeAvatarConfig);

  const handleChangeAvatar: JSX.EventHandler<HTMLInputElement, Event> = async (ev) => {
    const avatarFile = ev.currentTarget.files[0];
    if (!avatarFile) return;

    if (!avatarFile.type.startsWith("image") || avatarFile.size > 1048576) {
      setToast("头像必须为小于1M的图片", "error");
      return;
    }

    const { avatar } = await uploadFile(avatarFile);
    updateState({ ...state.user, avatar });
    setToast("头像更新成功", "success");
  };

  return { percentage, handleChangeAvatar };
};

export const useUpdateProfile = () => {
  const [state, { updateState, setToast }] = useAppContext();
  const updateUser = useFetchPrivate(UpdateUserConfig);

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({ nickname: "" });

  const handleUpdateProfile =
    (onClose: Accessor<void>): JSX.EventHandler<HTMLFormElement, Event> =>
    async (ev) => {
      ev.preventDefault();
      if (fields.nickname) {
        setLoading(true);
        try {
          const resp = await updateUser({
            userId: state.user?.id,
            nickname: fields.nickname || undefined,
          });
          updateState(resp.user);
          setToast("更改成功", "success");
          onClose();
        } catch (err) {
          if (err instanceof Error) {
            err.message && setToast(err.message, "error");
          }
        }
        setLoading(false);
      } else {
        onClose();
      }
    };

  return { loading, setFields, handleUpdateProfile };
};

export const useChangePassword = () => {
  const [_, { setToast }] = useAppContext();
  const changePassword = useFetchPrivate(ChangePasswordConfig);

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({ oldPassword: "", newPassword: "" });

  const handleChangePassword =
    (onClose: Accessor<void>): JSX.EventHandler<HTMLFormElement, Event> =>
    async (ev) => {
      ev.preventDefault();
      if (fields.oldPassword && fields.newPassword) {
        setLoading(true);
        try {
          await changePassword({
            oldPassword: fields.oldPassword,
            newPassword: fields.newPassword,
          });
          setToast("密码更改成功", "success");
          onClose();
        } catch (err) {
          if (err instanceof Error) {
            err.message && setToast(err.message, "error");
          }
        }
        setLoading(false);
      }
    };

  return { loading, handleChangePassword, setFields };
};
