import { Component } from "solid-js";

const NotFound: Component = () => {
  return (
    <div class="items-top relative flex min-h-screen justify-center bg-gray-100 sm:items-center sm:pt-0">
      <div class="mx-auto max-w-xl sm:px-6 lg:px-8">
        <div class="flex items-center pt-8 sm:justify-start sm:pt-0">
          <div class="border-r border-gray-400 px-4 text-lg tracking-wider text-gray-500">404</div>
          <div class="ml-4 text-lg uppercase tracking-wider text-gray-500">Not Found</div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
