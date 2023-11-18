import { Accessor, Component, For, Show, onMount } from "solid-js";
import { UserInfo } from "@/api";
import { fmtDate } from "@/utils/time";
import { Avatar, Confirm, RoleBanner, ActiveSolid, InactiveSolid, TrashSolid } from "../common";
import { useDeleteUser, useListUsers } from "./users.service";
import { CreateUserButton, EditUserButton } from "./Users.Widgets";

const UserItem: Component<{ item: UserInfo; reload: Accessor<void> }> = (props) => {
  const handleDeleteUser = useDeleteUser(props.reload);

  return (
    <tr class="cursor-default bg-white text-gray-700 hover:bg-gray-50">
      <td class="px-4 py-3">
        <div class="flex items-center text-sm">
          <Avatar src={props.item.avatar} class="mr-3 h-8 w-8 rounded-full" />
          <div>
            <p class="font-semibold">{props.item.username}</p>
            <p class="text-xs text-gray-600">{props.item.nickname}</p>
          </div>
        </div>
      </td>
      <td class="px-4 py-3">
        <RoleBanner role={props.item.role} />
      </td>
      <td class="px-4 py-3">
        <Show when={props.item.deleted} fallback={<ActiveSolid class="h-5 w-5 text-green-600" />}>
          <InactiveSolid class="h-5 w-5 text-red-500" />
        </Show>
      </td>
      <td class="px-4 py-3 text-sm text-gray-600">{fmtDate(props.item.createAt)}</td>
      <td class="px-4 py-3">
        <div class="flex items-center">
          <Confirm onConfirm={() => handleDeleteUser(props.item.id)}>
            <TrashSolid class="mr-4 h-5 w-5 cursor-pointer text-red-500" />
          </Confirm>
          <EditUserButton user={props.item} reload={props.reload} />
        </div>
      </td>
    </tr>
  );
};

const Users: Component = () => {
  const { users, pageInfo, pageDown, pageUp, reload } = useListUsers();

  onMount(reload);

  return (
    <div class="space-y-4 px-10 py-6">
      <h3 class="text-2xl font-semibold text-gray-600">Users</h3>

      <div class="w-full overflow-hidden rounded-lg shadow-md">
        <div class="flex justify-end bg-white p-3">
          <CreateUserButton reload={reload} />
        </div>
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b bg-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th class="px-4 py-3">Profile</th>
                <th class="px-4 py-3">Role</th>
                <th class="px-4 py-3">Active</th>
                <th class="px-4 py-3">Date</th>
                <th class="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y bg-white">
              <For each={users.data}>{(item) => <UserItem item={item} reload={reload} />}</For>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between border-t bg-white px-4 py-3 font-semibold uppercase tracking-wide text-gray-500">
          <span class="text-center text-xs">{pageInfo()}</span>

          <nav aria-label="Table navigation" class="inline-flex items-center px-2 text-sm">
            <button onClick={pageDown} class="mr-3 rounded-md border px-3 py-1 hover:bg-gray-100 active:bg-gray-50">
              Prev
            </button>
            <button onClick={pageUp} class="rounded-md border px-3 py-1 hover:bg-gray-100 active:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Users;
