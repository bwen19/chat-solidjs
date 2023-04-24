import { createSignal } from "solid-js";
import { useAppContext } from "@/AppContext";
import { ApiConfig } from "@/api";
import useRenewToken from "./useRenewToken";

export const useUpload = <T>(config: ApiConfig<T>) => {
  const [_, { setToast }] = useAppContext();
  const renewToken = useRenewToken();
  const [percentage, setPercentage] = createSignal(0);

  const xhr = new XMLHttpRequest();
  xhr.upload.onprogress = (ev) => {
    setPercentage(Math.floor((100 * ev.loaded) / ev.total));
  };

  let data: FormData;

  const uploadWithToken = async (token: string): Promise<T> => {
    xhr.open(config.method, config.url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          if (xhr.status == 400) {
            setToast(xhr.responseText, "error");
          } else {
            console.error(xhr.responseText);
          }
          reject(xhr.statusText);
        }
        setPercentage(0);
      };

      xhr.send(data);
    });
  };

  const uploadFile = async (file: File): Promise<T> => {
    const formData = new FormData();
    formData.append("File", file);
    data = formData;
    return renewToken(uploadWithToken);
  };

  return { percentage, uploadFile };
};
