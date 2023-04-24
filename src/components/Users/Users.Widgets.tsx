import { Accessor, Component, createSignal } from "solid-js";
import clickOutside from "@/utils/clickOutside";
import { Modal } from "../common";
import { useCreateUser, useUpdateUser } from "./users.service";
import { UserInfo } from "@/api";
import { EditSolid } from "../icons";
false && clickOutside;

export const CreateUserButton: Component<{ reload: Accessor<void> }> = (props) => {
  const [open, setOpen] = createSignal(false);

  const { loading, setFields, handleCreateUser } = useCreateUser(() => {
    setOpen(false);
    props.reload();
  });

  return (
    <>
      <button onClick={[setOpen, true]} class="rounded-md border bg-sky-700 px-3 py-1.5 text-sm text-white hover:bg-sky-600 active:bg-sky-700">
        Add user
      </button>
      <Modal open={open()}>
        <div use:clickOutside={() => setOpen(false)} class="w-96 overflow-hidden rounded-md bg-white">
          <div class="border-b py-3 pl-6">
            <h3 class="text-xl">Create New User</h3>
          </div>
          <form onSubmit={handleCreateUser} spellcheck={false}>
            <div class="space-y-2 px-8 py-5">
              <label for="username" class="text-gray-600">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                disabled={loading()}
                onInput={(ev) => setFields("username", ev.currentTarget.value)}
                class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>
            <div class="space-y-2 px-8 pb-7">
              <label for="password" class="text-gray-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                disabled={loading()}
                onInput={(ev) => setFields("password", ev.currentTarget.value)}
                class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>
            <div class="space-x-4 px-8 pb-7">
              <label for="role" class="text-gray-600">
                Role
              </label>
              <select
                id="role"
                name="currency"
                onInput={(ev) => setFields("role", ev.currentTarget.value)}
                class="h-full rounded-md border-gray-300 py-1 text-gray-500 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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

export const EditUserButton: Component<{ user: UserInfo; reload: Accessor<void> }> = (props) => {
  const [open, setOpen] = createSignal(false);
  const { loading, setFields, handleCreateUser } = useUpdateUser(props.user, () => {
    setOpen(false);
    props.reload();
  });

  return (
    <>
      <div onClick={[setOpen, true]}>
        <EditSolid class="h-5 w-5 cursor-pointer text-sky-600" />
      </div>
      <Modal open={open()}>
        <div use:clickOutside={() => setOpen(false)} class="w-96 overflow-hidden rounded-md bg-white">
          <div class="border-b py-3 pl-6">
            <h3 class="text-xl">Update User</h3>
          </div>
          <form onSubmit={handleCreateUser} spellcheck={false}>
            <div class="space-y-2 px-8 py-5">
              <label for="up-username" class="text-gray-600">
                Username
              </label>
              <input
                id="up-username"
                type="text"
                placeholder={props.user.username}
                disabled={loading()}
                onInput={(ev) => setFields("username", ev.currentTarget.value)}
                class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>
            <div class="space-y-2 px-8 pb-7">
              <label for="up-password" class="text-gray-600">
                Password
              </label>
              <input
                id="up-password"
                type="password"
                placeholder="New password"
                disabled={loading()}
                onInput={(ev) => setFields("password", ev.currentTarget.value)}
                class="w-full rounded-md border-gray-300 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>
            <div class="px-8 pb-7">
              <label for="up-role" class="mr-2 text-gray-600">
                Role
              </label>
              <select
                id="up-role"
                onInput={(ev) => setFields("role", ev.currentTarget.value)}
                value={props.user.role}
                class="h-full rounded-md border-gray-300 py-1 text-gray-500 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <label for="up-active" class="ml-6 mr-2 text-gray-600">
                Active
              </label>
              <select
                id="up-active"
                onInput={(ev) => setFields("active", ev.currentTarget.value)}
                value={props.user.deleted ? "no" : "yes"}
                class="h-full rounded-md border-gray-300 py-1 text-gray-500 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
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
