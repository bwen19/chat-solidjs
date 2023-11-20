import { Component } from "solid-js";
import { UserCard, ClientCard, RoomCard } from "./Card";
import { useHubStatus } from "./hub.service";
import { RefreshOutline } from "../common";

const Dashboard: Component = () => {
  const { status, reload } = useHubStatus();

  return (
    <div class="space-y-4 px-10 py-6">
      <h3 class="text-2xl font-semibold text-gray-600">Dashboard</h3>
      <div class="bg-white p-6">
        <div class="flex space-x-2">
          <h3 class="text-2xl font-semibold text-gray-600">Hub Status</h3>
          <div onClick={reload} class="cursor-pointer rounded-full p-2 text-sky-700 hover:text-sky-600 active:text-sky-500">
            <RefreshOutline class="h-4 w-4" />
          </div>
        </div>
        <div class="my-4 flex space-x-6">
          <UserCard numUsers={status().numUsers} />
          <ClientCard numClients={status().numClients} />
          <RoomCard numRooms={status().numRooms} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
