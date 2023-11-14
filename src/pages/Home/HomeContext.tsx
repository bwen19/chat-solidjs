import { createContext, onCleanup, onMount, ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { EventData, FriendInfo, RoomInfo } from "@/api";
import { useAppContext } from "@/AppContext";
import { todayEndTime } from "@/utils/time";
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
  today: Date;
};

type HomeContextValue = [
  state: HomeContextState,
  actions: {
    navHome: (currPage: PageName) => void;
    navRoom: (roomId: number) => void;
    navFriend: (friendId: number) => void;
    sendMessage: (action: string, data: EventData) => void;
  },
];

const HomeContext = createContext<HomeContextValue>();

export const HomeContextProvider: ParentComponent = (props) => {
  const [state, { setToast }] = useAppContext();
  const [homeState, setHomeState] = createStore<HomeContextState>({
    currPage: "chat",
    currRoom: 0,
    currFriend: 0,
    rooms: [],
    friends: [],
    totalUnreads: 0,
    numNewFriends: 0,
    disconnected: false,
    today: todayEndTime(),
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
  const sendMessage = (action: string, data: EventData) => ws.sendWsMessage(action, data);

  onMount(() => ws.connect(homeState.today));
  onCleanup(() => ws.disconnect());

  return <HomeContext.Provider value={[homeState, { navHome, navRoom, navFriend, sendMessage }]}>{props.children}</HomeContext.Provider>;
};

export const useHomeContext = () => useContext(HomeContext);
