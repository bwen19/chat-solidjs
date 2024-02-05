import { ApiConfig } from "@/api";
import { useAppContext } from "@/AppContext";
import { handleResponse } from "./handleResponse";
import useRenewToken from "./useRenewToken";

const useUpload = <T, P>(config: ApiConfig<T, P>) => {
  const [state] = useAppContext();
  const getAccessToken = useRenewToken();

  const uploadFile = async (file: File, param: P): Promise<T> => {
    const formData = new FormData();
    formData.append("file", file);

    const url = config.path ? `${config.url}/${param}` : config.url;

    const now = new Date();
    const date = new Date(state.expireAt);
    const accessToken = date < now ? await getAccessToken() : state.accessToken;

    return fetch(url, {
      method: config.method,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    }).then((rsp) => handleResponse<T>(rsp));
  };
  return uploadFile;
};

export default useUpload;
