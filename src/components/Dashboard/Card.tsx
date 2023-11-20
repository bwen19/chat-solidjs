import { Component } from "solid-js";
import { ClientOutline, RoomOutline, UserOutline } from "../common";

export const UserCard: Component<{ numUsers: number }> = (props) => {
  return (
    <div class="w-60 rounded-md bg-slate-100 p-6 shadow">
      <div class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-300">
        <UserOutline class="h-5 w-5" />
      </div>

      <div class="mt-4">
        <h4 class="text-xl font-bold text-sky-800">{props.numUsers}</h4>
        <span class="font-medium">Online Users</span>
      </div>
    </div>
  );
};

export const ClientCard: Component<{ numClients: number }> = (props) => {
  return (
    <div class="w-60 rounded-md bg-slate-100 p-6 shadow">
      <div class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-300">
        <ClientOutline class="h-5 w-5" />
      </div>

      <div class="mt-4">
        <h4 class="text-xl font-bold text-sky-800">{props.numClients}</h4>
        <span class="font-medium">Total Clients</span>
      </div>
    </div>
  );
};

export const RoomCard: Component<{ numRooms: number }> = (props) => {
  return (
    <div class="w-60 rounded-md bg-slate-100 p-6 shadow">
      <div class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-300">
        <RoomOutline class="h-5 w-5" />
      </div>

      <div class="mt-4">
        <h4 class="text-xl font-bold text-sky-800">{props.numRooms}</h4>
        <span class="font-medium">Chat Rooms</span>
      </div>
    </div>
  );
};
