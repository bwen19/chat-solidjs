import { useAppContext } from "@/AppContext";
import { RenewTokenConfig } from "@/api";
import { useAuthFetch } from "./useAuthFetch";

let accessTokenPromise: Promise<string> | undefined = undefined;

const useRenewToken = () => {
  const [state, { signOut, updateToken, setToast }] = useAppContext();
  const sendRenewToken = useAuthFetch(RenewTokenConfig);

  const renewToken = async (): Promise<string> => {
    try {
      const rsp = await sendRenewToken({ refreshToken: state.refreshToken });
      updateToken(rsp);
      return rsp.accessToken;
    } catch (err) {
      setToast("Your session has expired", "error");
      signOut();
      throw new Error();
    } finally {
      accessTokenPromise = undefined;
    }
  };

  const getAccessToken = async (): Promise<string> => {
    if (!accessTokenPromise) accessTokenPromise = renewToken();
    return accessTokenPromise;
  };

  return getAccessToken;
};

export default useRenewToken;
