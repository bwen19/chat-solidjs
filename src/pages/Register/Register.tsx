import { Component, Show } from "solid-js";
import registBgSrc from "@/assets/register-bg.jpg";
import registerLeftSrc from "@/assets/register-left.png";
import { EnvelopeSolid, LockSolid, Spin, UserSolid } from "@/components/icons";
import { useRegister } from "./register.service";

const Register: Component = () => {
  const { loading, setFields, handleSubmit } = useRegister();

  return (
    <div class="flex h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat px-2" style={{ "background-image": `url(${registBgSrc})` }}>
      <div class="flex w-full max-w-md overflow-hidden rounded-lg lg:max-w-4xl">
        <div class="hidden shrink-0 basis-1/2 lg:block">
          <img src={registerLeftSrc} alt="brain storming" class="h-full object-cover object-center" />
        </div>
        <div class="flex h-full grow items-center justify-center bg-gray-50">
          <div class="w-full p-16">
            <h2 class="text-center text-2xl font-semibold text-gray-700">Welcome</h2>
            <h2 class="text-center text-lg text-gray-500">Join Natter community</h2>
            <form onSubmit={handleSubmit} spellcheck={false} class="mt-4 space-y-8">
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserSolid class="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  minlength="2"
                  disabled={loading()}
                  onInput={(ev) => setFields("username", ev.currentTarget.value)}
                  class="peer w-full rounded-md border-gray-300 pl-10 placeholder:text-gray-300 invalid:border-rose-500 focus:ring-sky-600 focus:invalid:border-rose-500 focus:invalid:ring-rose-500"
                />
                <p class="invisible absolute inset-x-0 -bottom-6 text-sm text-rose-500 peer-invalid:visible">Please provide a valid username.</p>
              </div>

              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockSolid class="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  minlength="6"
                  disabled={loading()}
                  onInput={(ev) => setFields("password", ev.currentTarget.value)}
                  class="peer w-full rounded-md border-gray-300 pl-10 placeholder:text-gray-300 invalid:border-rose-500 focus:ring-sky-600 focus:invalid:border-rose-500 focus:invalid:ring-rose-500"
                />
                <p class="invisible absolute inset-x-0 -bottom-6 text-sm text-rose-500 peer-invalid:visible">Password must contain at least 6 characters.</p>
              </div>

              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeSolid class="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="code"
                  placeholder="Invitation Code"
                  minlength="4"
                  disabled={loading()}
                  onInput={(ev) => setFields("code", ev.currentTarget.value)}
                  class="peer w-full rounded-md border-gray-300 pl-10 placeholder:text-gray-300 invalid:border-rose-500 focus:ring-sky-600 focus:invalid:border-rose-500 focus:invalid:ring-rose-500"
                />
                <p class="invisible absolute inset-x-0 -bottom-6 text-sm text-rose-500 peer-invalid:visible">Please provide a valid invitation code.</p>
              </div>

              <Show
                when={loading()}
                fallback={
                  <button type="submit" class="my-2 w-full rounded-md bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 active:bg-sky-600">
                    Register
                  </button>
                }
              >
                <button type="button" disabled class="my-2 w-full cursor-default rounded-md bg-sky-700 py-2.5 text-sm font-semibold text-white">
                  <Spin class="mr-3 inline h-4 w-4 animate-spin text-teal-700 " />
                  Submitting ...
                </button>
              </Show>
              <div class="text-center text-sm">
                <span class="text-gray-600">Already have an account? </span>
                <a class="text-sky-600" href="/login">
                  Login here.
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
