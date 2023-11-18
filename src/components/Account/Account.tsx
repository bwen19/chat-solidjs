import { Component, createSignal, Match, Switch } from "solid-js";
import { useAppContext } from "@/AppContext";
import { Avatar } from "@/components/common";
import { LogoutModal } from "@/components";
import clickOutside from "@/utils/clickOutside";
import { ProfileModal, PasswordModal } from "./Account.Widgets";
false && clickOutside;

type MenuOptions = "none" | "main" | "profile" | "password" | "logout";

const AccountSetting: Component = () => {
  const [state] = useAppContext();

  const [opt, setOpt] = createSignal<MenuOptions>("none");
  const onClose = () => setOpt("none");
  const onCloseMain = () => opt() === "main" && setOpt("none");

  return (
    <div use:clickOutside={onCloseMain} class="relative flex items-center justify-center">
      <div onClick={() => setOpt("main")} class="cursor-pointer rounded-full hover:ring-2 hover:ring-gray-50">
        <Avatar src={state.user.avatar} class="h-10 w-10 rounded-full" />
      </div>

      <Switch>
        <Match when={opt() === "main"}>
          <div class="absolute bottom-4 left-14 z-10 w-44 divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div class="py-1.5 text-center text-gray-400">{state.user.username}</div>
            <div class="py-1">
              <div onClick={() => setOpt("profile")} class="cursor-pointer py-2 pl-6 text-sm text-gray-600 hover:bg-sky-600 hover:text-gray-50">
                Update Profile
              </div>
              <div onClick={() => setOpt("password")} class="cursor-pointer py-2 pl-6 text-sm text-gray-600 hover:bg-sky-600 hover:text-gray-50">
                Change Password
              </div>
            </div>
            <div class="py-1">
              <div onClick={() => setOpt("logout")} class="cursor-pointer py-2 pl-6 text-sm text-gray-600 hover:bg-sky-600 hover:text-gray-50">
                Logout
              </div>
            </div>
          </div>
        </Match>
        <Match when={opt() === "profile"}>
          <ProfileModal onClose={onClose} />
        </Match>
        <Match when={opt() === "password"}>
          <PasswordModal onClose={onClose} />
        </Match>
        <Match when={opt() === "logout"}>
          <LogoutModal onClose={onClose} />
        </Match>
      </Switch>
    </div>
  );
};

export default AccountSetting;
