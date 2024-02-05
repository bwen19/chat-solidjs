import { createContext, onCleanup, onMount, ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { ClientEvent, FriendInfo, RoomInfo } from "@/api";
import useRenewToken from "@/utils/useRenewToken";
import { useAppContext } from "@/AppContext";
import { WebSocketService } from "./websocket.service";

type PageName = "chat" | "friend";

export type HomeContextState = {
  currPage: PageName;
  currRoom: number;
  currFriend: number;
  rooms: RoomInfo[];
  friends: FriendInfo[];
  totalUnreads: number;
  numNewFriends: number;
  disconnected: boolean;
};

type HomeContextValue = [
  state: HomeContextState,
  actions: {
    navHome: (currPage: PageName) => void;
    navRoom: (roomId: number) => void;
    navFriend: (friendId: number) => void;
    sendMessage: (evt: ClientEvent) => void;
  },
];

const HomeContext = createContext<HomeContextValue>();

export const HomeContextProvider: ParentComponent = (props) => {
  const [state, { setToast }] = useAppContext();
  const getAccessToken = useRenewToken();

  const [homeState, setHomeState] = createStore<HomeContextState>({
    currPage: "chat",
    currRoom: 0,
    currFriend: 0,
    rooms: [],
    friends: [],
    totalUnreads: 0,
    numNewFriends: 0,
    disconnected: false,
  });

  const navHome = (pageName: PageName) => setHomeState("currPage", pageName);
  const navRoom = (roomId: number) => {
    setHomeState(
      produce((s) => {
        s.currPage = "chat";
        s.currRoom = roomId;
        const index = s.rooms.findIndex((x) => x.id === roomId);
        if (index !== -1) {
          s.totalUnreads -= s.rooms[index].unreads;
          s.rooms[index].unreads = 0;
        }
      }),
    );
  };
  const navFriend = (friendId: number) => setHomeState("currFriend", friendId);

  const ws = new WebSocketService(setHomeState, setToast);
  const sendMessage = (evt: ClientEvent) => ws.sendWsMessage(evt);

  onMount(async () => {
    const now = new Date();
    const date = new Date(state.expireAt);
    const accessToken = date < now ? await getAccessToken() : state.accessToken;
    ws.connect(accessToken);
  });

  onCleanup(() => ws.disconnect());

  return <HomeContext.Provider value={[homeState, { navHome, navRoom, navFriend, sendMessage }]}>{props.children}</HomeContext.Provider>;
};

export const useHomeContext = () => useContext(HomeContext);
