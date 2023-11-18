import { createSignal } from "solid-js";
import { ClientEvent, FindUserConfig, UserInfo } from "@/api";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { useFetchPrivate } from "@/utils/fetch";

export const useFriend = () => {
  const [_, { sendMessage }] = useHomeContext();

  const handleAddFriend = (userId: number) => {
    const evt: ClientEvent = { action: "add-friend", data: { friendId: userId } };
    sendMessage(evt);
  };

  const handleAcceptFriend = (userId: number) => {
    const evt: ClientEvent = { action: "accept-friend", data: { friendId: userId } };
    sendMessage(evt);
  };

  const handleRefuseFriend = (userId: number) => {
    const evt: ClientEvent = { action: "refuse-friend", data: { friendId: userId } };
    sendMessage(evt);
  };

  const handleDeleteFriend = (userId: number) => {
    const evt: ClientEvent = { action: "delete-friend", data: { friendId: userId } };
    sendMessage(evt);
  };

  return { handleAddFriend, handleAcceptFriend, handleRefuseFriend, handleDeleteFriend };
};

export const useFindUser = () => {
  const [_, { setToast }] = useAppContext();
  const findUser = useFetchPrivate(FindUserConfig);

  const [searched, setSearched] = createSignal<UserInfo>();

  const handleSearch = async (keyword: string) => {
    if (keyword.length < 2) {
      setSearched(undefined);
      return;
    }

    try {
      const resp = await findUser(keyword);
      setSearched(resp?.user);
    } catch (err) {
      if (err instanceof Error) {
        err.message && setToast(err.message, "error");
      }
      setSearched(undefined);
    }
  };

  return { searched, handleSearch };
};
