import { Component, Match, Switch } from "solid-js";
import homeBgSrc from "@/assets/home-bg.jpg";
import { Account, Chat, Friend } from "@/components";
import { Badge, ChatOutline, FriendOutline, Logo } from "@/components/common";
import { HomeContextProvider, useHomeContext } from "./HomeContext";
import { DisconnectionModal } from "./Home.Widgets";

const Home: Component = () => {
  const [homeState, { navHome }] = useHomeContext();

  return (
    <div class="flex h-screen w-full min-w-fit items-center justify-center bg-cover p-5 lg:py-20" style={{ "background-image": `url(${homeBgSrc})` }}>
      <div class="flex h-full w-full max-w-5xl items-center justify-center overflow-hidden rounded-md shadow-lg">
        <div class="flex h-full w-16 shrink-0 flex-col bg-gray-800 pb-3">
          <div class="grow">
            <div class="flex h-16 items-center justify-center">
              <Logo class="h-9 w-9" />
            </div>

            <div class="flex flex-col items-center space-y-1">
              <div
                onClick={() => navHome("chat")}
                class={`cursor-pointer rounded-full p-2 hover:text-gray-300 ${homeState.currPage === "chat" ? "text-gray-300" : "text-gray-500"}`}
              >
                <Badge num={homeState.totalUnreads}>
                  <ChatOutline class="h-8 w-8" />
                </Badge>
              </div>
              <div
                onClick={() => navHome("friend")}
                class={`cursor-pointer rounded-full p-2 hover:text-gray-300 ${homeState.currPage === "friend" ? "text-gray-300" : "text-gray-500"}`}
              >
                <Badge num={homeState.numNewFriends}>
                  <FriendOutline class="h-8 w-8" />
                </Badge>
              </div>
            </div>
          </div>

          <div class="h-16 shrink-0">
            <Account />
          </div>
        </div>
        <div class="h-full grow">
          <Switch>
            <Match when={homeState.currPage === "chat"}>
              <Chat />
            </Match>
            <Match when={homeState.currPage === "friend"}>
              <Friend />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
};

const HomePage: Component = () => {
  return (
    <HomeContextProvider>
      <Home />
      <DisconnectionModal />
    </HomeContextProvider>
  );
};

export default HomePage;
