import { Accessor, Component, For, createSignal } from "solid-js";
import { Invitaition } from "@/api/invitaion";
import { Confirm } from "../common";
import { fmtDate } from "@/utils/time";
import { TrashSolid } from "../icons";
import { useDeleteInvitations, useListInvitations } from "./invitations.service";
import { CreateInvitationButton } from "./Invitations.Widgets";

const InvitationItem: Component<{ item: Invitaition; reload: Accessor<void> }> = (props) => {
  const handleDeleteInvitations = useDeleteInvitations(props.reload);

  return (
    <tr class="cursor-default bg-white text-gray-700 hover:bg-gray-50">
      <td class="px-4 py-3">
        <div class="flex items-center text-sm">{props.item.code}</div>
      </td>

      <td class="px-4 py-3 text-sm text-gray-600">{fmtDate(props.item.expire_at)}</td>
      <td class="py-3 px-4">
        <div class="flex items-center">
          <Confirm onConfirm={() => handleDeleteInvitations(props.item.code)}>
            <TrashSolid class="mr-4 h-5 w-5 cursor-pointer text-red-500" />
          </Confirm>
        </div>
      </td>
    </tr>
  );
};

const Invitations: Component = () => {
  const { invitations, pageInfo, pageDown, pageUp, reload } = useListInvitations();

  return (
    <div class="space-y-4 py-6 px-10">
      <h3 class="text-2xl font-semibold text-gray-600">Invitations</h3>

      <div class="w-full overflow-hidden rounded-lg shadow-md">
        <div class="flex justify-between bg-white p-3">
          <CreateInvitationButton reload={reload} />
        </div>
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b bg-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th class="px-4 py-3">Code</th>
                <th class="px-4 py-3">Expire Date</th>
                <th class="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y bg-white">
              <For each={invitations.data}>{(item) => <InvitationItem item={item} reload={reload} />}</For>
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

export default Invitations;
