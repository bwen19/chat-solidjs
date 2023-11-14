import { useAppContext } from "@/AppContext";
import { RenewTokenConfig } from "@/api";
import { useFetchAuth } from "./fetch";

let isRenewing = false;

type IRequest = (token: string) => void;
let requestQueue: IRequest[] = [];

const useRenewToken = () => {
  const [state, { signOut, updateState, setToast }] = useAppContext();
  const renewTokenApi = useFetchAuth(RenewTokenConfig);

  const renewToken = async <T>(cb: (token: string) => Promise<T>): Promise<T> => {
    if (isRenewing) {
      return new Promise<T>((resolve) => {
        requestQueue.push((token: string) => resolve(cb(token)));
      });
    }

    isRenewing = true;

    return renewTokenApi()
      .then(({ access_token }) => {
        updateState(null, access_token);
        requestQueue.forEach((request) => request(access_token));
        return cb(access_token);
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
