import { ApiConfig } from "@/api";

export const handleResponse = async <D>(rsp: Response): Promise<D> => {
  if (rsp.status === 200) {
    if (rsp.headers.get("Content-Type")?.startsWith("application/json")) {
      return rsp?.json() as D;
    }
  } else {
    const errMsg = await rsp.text();
    if (rsp.status == 500) {
      console.error(errMsg);
      throw new Error();
    } else {
      throw new Error(errMsg);
    }
  }
};

const useAuthFetch = <T, P>(config: ApiConfig<T, P>) => {
  const sendAuthRequest = async (param?: P): Promise<T> => {
    return fetch(config.url, {
      method: config.method,
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: param && JSON.stringify(param),
    }).then((rsp) => handleResponse<T>(rsp));
  };
  return sendAuthRequest;
};

export default useAuthFetch;
