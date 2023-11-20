import { useAppContext } from "@/AppContext";
import { RenewTokenConfig } from "@/api";
import useAuthFetch from "./useAuthFetch";

let isRenewing = false;

type IRequest = (token: string) => void;
let requestQueue: IRequest[] = [];

const useRenewToken = () => {
  const [_, { signOut, updateState, setToast }] = useAppContext();
  const sendRenewToken = useAuthFetch(RenewTokenConfig);

  const renewToken = async <T>(cb: (token: string) => Promise<T>): Promise<T> => {
    if (isRenewing) {
      return new Promise<T>((resolve) => {
        requestQueue.push((token: string) => resolve(cb(token)));
      });
    }

    isRenewing = true;

    return sendRenewToken()
      .then(({ accessToken }) => {
        updateState(null, accessToken);
        requestQueue.forEach((request) => request(accessToken));
        return cb(accessToken);
      })
      .catch(() => {
        setToast("You login has expired!", "error");
        signOut();
        throw new Error();
      })
      .finally(() => {
        isRenewing = false;
        requestQueue = [];
      });
  };

  return renewToken;
};

export default useRenewToken;
