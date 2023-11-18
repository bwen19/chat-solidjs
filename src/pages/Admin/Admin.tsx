import { Component, For } from "solid-js";
import { A, Outlet } from "@solidjs/router";
import { Avatar, RoleBanner, FriendOutline, HomeOutline, Logo, PowerOutline } from "@/components/common";
import { useAppContext } from "@/AppContext";
import { LogoutModalWrapper } from "@/components";

type MenuInfo = {
  name: string;
  path: string;
  icon: Component;
};

const menus: MenuInfo[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: HomeOutline,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: FriendOutline,
  },
];

const MenuItem: Component<{ item: MenuInfo }> = (props) => {
  return (
    <li class="mx-2 overflow-hidden rounded-md lg:mx-4">
      <A
        href={props.item.path}
        class="flex w-full items-center justify-center px-1 py-2 lg:justify-start lg:px-6 lg:py-3"
        activeClass="bg-sky-200 text-sky-600"
        inactiveClass="bg-white text-gray-600 hover:bg-sky-200 hover:text-sky-600"
      >
        <div class="shrink-0">
          <props.item.icon />
        </div>
        <div class="ml-3 hidden lg:block">
          <span class="line-clamp-1 ">{props.item.name}</span>
        </div>
      </A>
    </li>
  );
};

const Admin: Component = () => {
  const [state] = useAppContext();

  return (
    <div class="h-screen bg-white">
      <div class="fixed left-0 top-0 z-10 flex h-full w-14 flex-col lg:w-72">
        <div class="border-b pb-4">
          <div class="flex h-16 items-center justify-center lg:h-20">
            <Logo class="h-9 w-9" />
            <div class="hidden lg:block">
              <span class="ml-4 text-2xl font-semibold text-gray-600">Natter admin</span>
            </div>
          </div>
          <div class="flex items-center justify-center lg:justify-start lg:pl-10">
            <Avatar src={state.user.avatar} class="h-9 w-9 rounded-full lg:h-12 lg:w-12" />
            <div class="hidden lg:block">
              <h3 class="mx-4 inline-block text-lg font-semibold text-gray-600">{state.user.nickname}</h3>
              <RoleBanner role="admin" />
            </div>
          </div>
        </div>

        <ul class="grow space-y-1 pt-3">
          <For each={menus}>{(item) => <MenuItem item={item} />}</For>
        </ul>

        <div class="shrink-0 border-t pb-6 pt-2">
          <LogoutModalWrapper>
            <div class="mx-2 cursor-pointer overflow-hidden rounded-md lg:mx-4">
              <div class="flex w-full items-center justify-center px-1 py-2 text-gray-500 hover:bg-sky-200 hover:text-sky-600 lg:justify-start lg:px-6 lg:py-3">
                <PowerOutline class="h-5 w-5 shrink-0" />
                <div class="ml-3 hidden lg:block">
                  <span class="line-clamp-1">Log out</span>
                </div>
              </div>
            </div>
          </LogoutModalWrapper>
        </div>
      </div>

      <div class="ml-14 flex min-h-full flex-col bg-gray-100 lg:ml-72">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
