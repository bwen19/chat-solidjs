import { Component, createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAppContext } from "@/AppContext";
import { Avatar } from "@/components/common";
import { LogoutModal } from "@/components/Logout";
import clickOutside from "@/utils/clickOutside";
import { ProfileModal, PasswordModal } from "./Home.Widgets";
false && clickOutside;

const AccountSetting: Component = () => {
  const [state] = useAppContext();
  const [open, setOpen] = createSignal(false);

  const [openProfile, setOpenProfile] = createSignal(false);
  const showProfileModal = () => {
    setOpenProfile(true);
    setOpen(false);
  };

  const [openPassword, setOpenPassword] = createSignal(false);
  const showPasswordModal = () => {
    setOpenPassword(true);
    setOpen(false);
  };

  return (
    <div use:clickOutside={() => setOpen(false)} class="relative flex items-center justify-center">
      <div onClick={() => setOpen((v) => !v)} class="cursor-pointer rounded-full hover:ring-2 hover:ring-gray-50">
        <Avatar src={state.user.avatar} class="h-10 w-10 rounded-full" />
      </div>

      <Show when={open()}>
        <div class="absolute bottom-4 left-14 z-10 w-44 divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="py-1.5 text-center text-gray-400">{state.user.username}</div>
          <div class="py-1">
            <div onClick={showProfileModal} class="cursor-pointer py-2 pl-6 text-sm text-gray-600 hover:bg-sky-600 hover:text-gray-50">
              Update Profile
            </div>
            <div onClick={showPasswordModal} class="cursor-pointer py-2 pl-6 text-sm text-gray-600 hover:bg-sky-600 hover:text-gray-50">
              Change Password
            </div>
            <Show when={state.user?.role === "admin"}>
              <A href="/admin">
                <div class="py-2 pl-6 text-sm text-gray-600 hover:bg-sky-600 hover:text-gray-50">Administrate</div>
              </A>
            </Show>
          </div>
          <div class="py-1">
            <LogoutModal>
              <div class="cursor-pointer py-2 pl-6 text-sm text-gray-600 hover:bg-sky-600 hover:text-gray-50">Logout</div>
            </LogoutModal>
          </div>
        </div>
      </Show>
      <ProfileModal open={openProfile()} onClose={() => setOpenProfile(false)} />
      <PasswordModal open={openPassword()} onClose={() => setOpenPassword(false)} />
    </div>
  );
};

export default AccountSetting;
