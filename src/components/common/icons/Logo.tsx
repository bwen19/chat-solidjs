import { Component } from "solid-js";
import logoSrc from "@/assets/logo.png";
import logoNameSrc from "@/assets/logo-name.png";

export const Logo: Component<{ class: string }> = (props) => {
  return <img src={logoSrc} alt="site logo" class={props.class} />;
};

export const LogoName: Component<{ class: string }> = (props) => {
  return <img src={logoNameSrc} alt="site logo" class={props.class} />;
};
