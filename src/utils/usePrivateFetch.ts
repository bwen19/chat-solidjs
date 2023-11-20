import { useAppContext } from "@/AppContext";
import { ApiConfig } from "@/api";
import { handleResponse } from "./useAuthFetch";
import useRenewToken from "./useRenewToken";

const usePrivateFetch = <T, P>(config: ApiConfig<T, P>) => {
  const [state] = useAppContext();
  const renewToken = useRenewToken();

  let url = config.url;
  let method = config.method;
  let body: string | undefined = undefined;

  const sendRequest = async (param?: P): Promise<T> => {
    if (param) {
      if (config.path) {
        url = `${config.url}/${param}`;
      } else if (config.method === "GET") {
        const query = new URLSearchParams(Object.entries(param).filter((v) => typeof v[1] !== "undefined")).toString();
        url = `${config.url}?${query}`;
      } else {
        body = JSON.stringify(param);
      }
    }

    return fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.token}` },
      credentials: "omit",
      body,
    }).then((rsp) => {
      if (rsp.status === 203) {
        return renewToken<T>(tryWithNewToken);
      } else {
        return handleResponse<T>(rsp);
      }
    });
  };

  const tryWithNewToken = async <T>(token: string): Promise<T> => {
    return fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "omit",
      body,
    }).then((rsp) => handleResponse<T>(rsp));
  };

  return sendRequest;
};

export default usePrivateFetch;
