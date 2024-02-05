import { useAppContext } from "@/AppContext";
import { ApiConfig } from "@/api";
import { handleResponse } from "./handleResponse";
import useRenewToken from "./useRenewToken";

const usePrivateFetch = <T, P>(config: ApiConfig<T, P>) => {
  const [state] = useAppContext();
  const getAccessToken = useRenewToken();

  const sendRequest = async (param: P): Promise<T> => {
    let url = config.url;
    let method = config.method;
    let body: string | undefined = undefined;

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

    try {
      const rsp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.accessToken}` },
        body,
      });
      if (rsp.status === 203) {
        const accessToken = await getAccessToken();
        const newRsp = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body,
        });
        return handleResponse<T>(newRsp);
      } else {
        return handleResponse<T>(rsp);
      }
    } catch (e) {
      throw new Error("Something went wrong");
    }
  };

  return sendRequest;
};

export default usePrivateFetch;
