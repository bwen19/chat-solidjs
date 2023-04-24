import { Component } from "solid-js";

const RoleBanner: Component<{ role: string }> = (props) => {
  const color = () => {
    if (props.role === "admin") {
      return "bg-orange-100 text-orange-700";
    } else {
      return "bg-green-100 text-green-700";
    }
  };
  return <span class={`rounded-full px-2 py-1 text-xs font-semibold capitalize leading-tight ${color()}`}>{props.role}</span>;
};

export default RoleBanner;
