import { createSignal } from "solid-js";
import { AcceptFriendRequest, AddFriendRequest, DeleteFriendRequest, GetUserByNameConfig, RefuseFriendRequest, UserInfo } from "@/api";
import { useAppContext } from "@/AppContext";
import { useHomeContext } from "@/pages/Home/HomeContext";
import { useFetchPrivate } from "@/utils/fetch";

export const useFriend = () => {
  const [_, { sendMessage }] = useHomeContext();

  const handleAddFriend = (userId: number) => {
    const req: AddFriendRequest = {
      AddFriend: { friend_id: userId },
    };
    sendMessage(req);
  };

  const handleAcceptFriend = (userId: number) => {
    const req: AcceptFriendRequest = {
      AcceptFriend: { friend_id: userId },
    };
    sendMessage(req);
  };

  const handleRefuseFriend = (userId: number) => {
    const req: RefuseFriendRequest = {
      RefuseFriend: { friend_id: userId },
    };
    sendMessage(req);
  };

  const handleDeleteFriend = (userId: number) => {
    const req: DeleteFriendRequest = {
      DeleteFriend: { friend_id: userId },
    };
    sendMessage(req);
  };

  return { handleAddFriend, handleAcceptFriend, handleRefuseFriend, handleDeleteFriend };
};

export const useFindUser = () => {
  const [_, { setToast }] = useAppContext();
  const getUserByName = useFetchPrivate(GetUserByNameConfig);

  const [searched, setSearched] = createSignal<UserInfo>();

  const handleSearch = async (keyword: string) => {
    if (keyword.length < 2) {
      setSearched(undefined);
      return;
    }

    try {
      const resp = await getUserByName({ username: keyword });
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
