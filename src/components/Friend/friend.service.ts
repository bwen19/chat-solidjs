import { createSignal } from "solid-js";
import { AcceptFriendRequest, AddFriendRequest, DeleteFriendRequest, FindUserConfig, RefuseFriendRequest, UserInfo } from "@/api";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { useFetchPrivate } from "@/utils/fetch";

export const useFriend = () => {
  const [_, { sendMessage }] = useHomeContext();

  const handleAddFriend = (userId: number) => {
    const req: AddFriendRequest = { friend_id: userId };
    sendMessage("add-friend", req);
  };

  const handleAcceptFriend = (userId: number) => {
    const req: AcceptFriendRequest = { friend_id: userId };
    sendMessage("accept-friend", req);
  };

  const handleRefuseFriend = (userId: number) => {
    const req: RefuseFriendRequest = { friend_id: userId };
    sendMessage("refuse-friend", req);
  };

  const handleDeleteFriend = (userId: number) => {
    const req: DeleteFriendRequest = { friend_id: userId };
    sendMessage("delete-friend", req);
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
