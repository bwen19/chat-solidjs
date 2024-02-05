import { createSignal, onMount } from "solid-js";
import { HubStatusConfig, HubStatusResponse } from "@/api";
import usePrivateFetch from "@/utils/usePrivateFetch";

export const useHubStatus = () => {
  const [status, setStatus] = createSignal<HubStatusResponse>({
    numUsers: 0,
    numClients: 0,
    numRooms: 0,
  });

  const getStatus = usePrivateFetch(HubStatusConfig);

  const reload = async () => {
    try {
      const rsp = await getStatus(null);
      setStatus(rsp);
    } catch (err) {
      console.error(err);
    }
  };

  onMount(() => reload());

  return { status, reload };
};
