import { Component } from "solid-js";
import { Clock } from "./Clock";

const Dashboard: Component = () => {
  return (
    <div class="space-y-4 py-6 px-10">
      <h3 class="text-2xl font-semibold text-gray-600">Dashboard</h3>
      <div class="w-80 h-80 bg-white rounded-md p-6">
        <Clock />
      </div>
    </div>
  );
};

export default Dashboard;
