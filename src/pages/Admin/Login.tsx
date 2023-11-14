import { Component, Show } from "solid-js";
import loginBgSrc from "@/assets/login-bg.jpg";
import { LockSolid, Spin, UserSolid } from "@/components/icons";
import { useAppContext } from "@/AppContext";
import { useLogin } from "../Login/login.service";

const Login: Component = () => {
  const [state] = useAppContext();
  const { loading, handleSubmit, setFields } = useLogin(true);

  return (
    <div class="flex h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat px-2" style={{ "background-image": `url(${loginBgSrc})` }}>
      <div class="flex w-full max-w-md overflow-hidden rounded-lg bg-gray-300 bg-opacity-70">
        <div class="h-full w-full p-16">
          <h3 class="text-center text-3xl font-bold text-gray-900">Welcome back</h3>
          <form onSubmit={handleSubmit} spellcheck={false} class="mt-10 space-y-7">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserSolid class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                disabled={loading()}
                onInput={(ev) => setFields("username", ev.currentTarget.value)}
                class="w-full rounded-md border-gray-300 py-3  pl-10 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>

            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockSolid class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                disabled={loading()}
                onInput={(ev) => setFields("password", ev.currentTarget.value)}
                class="w-full rounded-md border-gray-300 py-3 pl-10 placeholder:text-gray-300 focus:border-sky-600 focus:ring-sky-600"
              />
            </div>

            <Show
              when={loading()}
              fallback={
                <button type="submit" class="my-2 w-full rounded-md bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 active:bg-sky-600">
                  Log In
                </button>
              }
            >
              <button type="button" disabled class="my-2 w-full cursor-default rounded-md bg-sky-700 py-3 font-semibold text-white">
                <Spin class="mr-3 inline h-4 w-4 animate-spin text-teal-700 " />
                Processing ...
              </button>
            </Show>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
