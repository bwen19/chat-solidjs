import { useAppContext } from "@/AppContext";
import { ApiConfig } from "@/api";
import useRenewToken from "./useRenewToken";

const handleResponse = async <D>(resp: Response): Promise<D> => {
  if (resp.status === 200) {
    if (resp.headers.get("Content-Type") === "application/json") {
      return resp?.json() as D;
    }
  } else {
    const errMsg = await resp.text();
    if (resp.status == 400) {
      throw new Error(errMsg);
    } else {
      console.error(errMsg);
      throw new Error();
    }
  }
};

export const useFetchAuth = <T, P>(config: ApiConfig<T, P>) => {
  const fetchAuth = async (param?: P): Promise<T> => {
    return fetch(config.url, {
      method: config.method,
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(param),
    }).then((resp) => handleResponse<T>(resp));
  };
  return fetchAuth;
};

export const useFetchPrivate = <T, P>(config: ApiConfig<T, P>) => {
  const [state] = useAppContext();
  const renewToken = useRenewToken();

  let url = config.url;
  let method = config.method;
  let body: string | undefined;

  const fetchWithToken = async <T>(token: string): Promise<T> => {
    return fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "omit",
      body,
    }).then((resp) => handleResponse<T>(resp));
  };

  const fetchPrivate = async (param: P): Promise<T> => {
    if (config.method === "GET") {
      const query = new URLSearchParams(Object.entries(param).filter((v) => typeof v[1] !== "undefined")).toString();
      url = `${config.url}?${query}`;
      body = undefined;
    } else {
      body = JSON.stringify(param);
    }

    return fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.token}` },
      credentials: "omit",
      body,
    }).then((resp) => {
      if (resp.status === 203) {
        return renewToken<T>(fetchWithToken);
      } else {
        return handleResponse<T>(resp);
      }
    });
  };

  return fetchPrivate;
};
