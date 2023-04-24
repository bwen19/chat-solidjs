import { Component } from "solid-js";
import avatarSrc from "@/assets/anonym.png";

const Avatar: Component<{ class: string; src: string }> = (props) => {
  return <img class={props.class} src={props.src} alt="avatar" onError={(ev) => (ev.currentTarget.src = avatarSrc)} />;
};

export default Avatar;
