import { Accessor, Component, createEffect } from "solid-js";
import { useAppContext } from "@/AppContext";
import { Avatar, Modal } from "@/components/common";
import { useLogout } from "@/components/Logout";
import { UploadOutline, WarnOutline } from "@/components/icons";
import clickOutside from "@/utils/clickOutside";
import { useChangeAvatar, useChangePassword, useUpdateProfile } from "./account.service";
import { useHomeContext } from "./HomeContext";
false && clickOutside;

export const ProfileModal: Component<{ open: boolean; onClose: Accessor<void> }> = (props) => {
  const [state] = useAppContext();
  const { percentage, handleChangeAvatar } = useChangeAvatar();
  const { loading, setFields, handleUpdateProfile } = useUpdateProfile();

  return (
    <Modal open={props.open}>
      <div use:clickOutside={props.onClose} class="w-96 overflow-hidden rounded-md bg-white">
        <div class="border-b py-3 pl-6">
          <h3 class="text-xl">User profile</h3>
        </div>
        <div class="my-4 flex flex-col items-center">
          <label for="avatar-file" class="group relative h-24 w-24 overflow-hidden rounded-full hover:cursor-pointer">
            <Avatar src={state.user?.avatar} class="h-24 w-24 rounded-full" />
            <div class="absolute inset-0 hidden bg-gray-700 bg-opacity-70 transition-opacity group-hover:block">
              <div class="flex h-full w-full flex-col items-center justify-center space-y-2">
                <UploadOutline class="h-6 w-6 text-white" />
                <p class="text-sm font-semibold text-white">修改头像</p>
              </div>
            </div>
            <input onChange={handleChangeAvatar} id="avatar-file" type="file" class="hidden" />
          </label>
          <p class="mt-2 text-center">{state.user?.username}</p>
        </div>
        <form onSubmit={handleUpdateProfile(props.onClose)} spellcheck={false}>
          <div class="space-y-2 px-8 pb-5">
            <label for="nickname" class="text-gray-500">
              Nickname
            </label>
            <input
              id="nickname"
              type="text"
              placeholder={state.user?.nickname}
              disabled={loading()}
              onInput={(ev) => setFields("nickname", ev.currentTarget.value)}
              class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
            />
          </div>

          <div class="space-x-4 bg-gray-100 px-8 py-3 text-right">
            <button onClick={props.onClose} type="button" class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-200">
              Cancel
            </button>
            <button disabled={loading()} type="submit" class="rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export const PasswordModal: Component<{ open: boolean; onClose: Accessor<void> }> = (props) => {
  const { loading, handleChangePassword, setFields } = useChangePassword();

  return (
    <Modal open={props.open}>
      <div use:clickOutside={props.onClose} class="w-96 overflow-hidden rounded-md bg-white">
        <div class="border-b py-3 pl-6">
          <h3 class="text-xl">Change password</h3>
        </div>
        <form onSubmit={handleChangePassword(props.onClose)} spellcheck={false}>
          <div class="space-y-2 px-8 py-5">
            <label for="password" class="text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Old password"
              disabled={loading()}
              onInput={(ev) => setFields("oldPassword", ev.currentTarget.value)}
              class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
            />
          </div>
          <div class="space-y-2 px-8 pb-7">
            <label for="new-password" class="text-gray-600">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="New password"
              disabled={loading()}
              onInput={(ev) => setFields("newPassword", ev.currentTarget.value)}
              class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
            />
          </div>

          <div class="space-x-4 bg-gray-100 px-8 py-3 text-right">
            <button onClick={props.onClose} type="button" class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-200">
              Cancel
            </button>
            <button disabled={loading()} type="submit" class="rounded-md bg-sky-700 p-2 text-sm font-semibold text-white hover:bg-sky-600 active:bg-sky-600">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export const DisconnectionModal: Component = () => {
  const [_, { signOut }] = useAppContext();
  const [homeState] = useHomeContext();
  const { handleLogout } = useLogout(false);

  createEffect(() => {
    if (homeState.disconnected) handleLogout();
  });

  return (
    <Modal open={homeState.disconnected}>
      <div class="w-96 rounded-md bg-white">
        <div class="flex flex-col items-center space-y-8 py-8">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-rose-200">
            <WarnOutline class="h-8 w-8 text-rose-600" />
          </div>
          <div>
            <h3 class="text-center text-xl font-semibold">Disconnected</h3>
            <p class="mt-3 px-8 text-center text-gray-500">You have been disconnected from the server. Please login again.</p>
          </div>
          <div class="flex justify-end space-x-6">
            <button
              type="button"
              onClick={signOut}
              class="inline-flex justify-center rounded-md bg-rose-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
