import { Accessor, Component, createSignal } from "solid-js";
import clickOutside from "@/utils/clickOutside";
import { Modal } from "../common";
import { useCreateInvitation } from "./invitations.service";
false && clickOutside;

export const CreateInvitationButton: Component<{ reload: Accessor<void> }> = (props) => {
  const [open, setOpen] = createSignal(false);

  const { loading, setFields, handleCreateInvitation } = useCreateInvitation(() => {
    props.reload();
  });

  return (
    <>
      <button onClick={[setOpen, true]} class="rounded-md border bg-sky-700 px-3 py-1.5 text-sm text-white hover:bg-sky-600 active:bg-sky-700">
        Add new code
      </button>
      <Modal open={open()}>
        <div use:clickOutside={() => setOpen(false)} class="w-96 overflow-hidden rounded-md bg-white">
          <div class="border-b py-3 pl-6">
            <h3 class="text-xl">Create new invitation</h3>
          </div>
          <form onSubmit={handleCreateInvitation} spellcheck={false}>
            <div class="space-y-2 px-8 py-5">
              <label for="length" class="text-gray-600">
                Length
              </label>
              <input
                id="length"
                type="number"
                placeholder="Invitation code length"
                disabled={loading()}
                onInput={(ev) => setFields("length", parseInt(ev.currentTarget.value, 10))}
                class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>
            <div class="space-y-2 px-8 pb-7">
              <label for="days" class="text-gray-600">
                Days
              </label>
              <input
                id="days"
                type="number"
                placeholder="Max age"
                disabled={loading()}
                onInput={(ev) => setFields("days", parseInt(ev.currentTarget.value, 10))}
                class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>

            <div class="space-x-4 bg-gray-100 px-8 py-3 text-right">
              <button
                onClick={[setOpen, false]}
                type="button"
                class="rounded-md border border-gray-300 p-2 text-sm font-semibold text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button disabled={loading()} type="submit" class="rounded-md bg-sky-700 p-2 text-sm font-semibold text-white hover:bg-sky-600 active:bg-sky-600">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
