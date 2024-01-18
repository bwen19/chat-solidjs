import { ApiConfig } from "@/api";
import { handleResponse } from "./useAuthFetch";
import { useAppContext } from "@/AppContext";

const useUpload = <T, P>(config: ApiConfig<T, P>) => {
  const [state] = useAppContext();

  const uploadFile = async (file: File, param?: P): Promise<T> => {
    const formData = new FormData();
    formData.append("file", file);

    const url = config.path ? `${config.url}/${param}` : config.url;

    return fetch(url, {
      method: config.method,
      headers: { Authorization: `Bearer ${state.refreshToken}` },
      body: formData,
    }).then((rsp) => handleResponse<T>(rsp));
  };
  return uploadFile;
};

export default useUpload;
