import { useAppContext } from "@/AppContext";
import { CreateInvitationConfig, DeleteInvitationsConfig, Invitaition, ListInvitationsConfig } from "@/api/invitaion";
import { useFetchPrivate } from "@/utils/fetch";
import { Accessor, JSX, createEffect, createSignal, on } from "solid-js";
import { createStore, produce } from "solid-js/store";

type InvitationsData = {
  status: "Idle" | "Fetching" | "Failed" | "Done";
  pageId: number;
  pageSize: number;
  total: number;
  data: Invitaition[];
};

export const useListInvitations = () => {
  const [invitations, setInvitations] = createStore<InvitationsData>({
    status: "Idle",
    pageId: 1,
    pageSize: 5,
    total: 0,
    data: [],
  });

  const pageInfo = () => {
    if (!invitations.data) return "";
    const numStart = (invitations.pageId - 1) * invitations.pageSize + 1;
    const numEnd = Math.min(invitations.total, invitations.pageId * invitations.pageSize);
    return `Showing ${numStart}-${numEnd} of ${invitations.total}`;
  };

  const pageDown = () => {
    if (invitations.pageId > 1) {
      setInvitations(produce((s) => (s.pageId = s.pageId - 1)));
    }
  };

  const pageUp = () => {
    const numStart = invitations.pageId * invitations.pageSize + 1;
    if (numStart < invitations.total) {
      setInvitations(
        produce((s) => {
          s.pageId = s.pageId + 1;
          s.status = "Idle";
        })
      );
    }
  };

  const listInvitations = useFetchPrivate(ListInvitationsConfig);

  const reload = () => setInvitations("status", "Idle");

  createEffect(
    on(
      () => invitations.status,
      async () => {
        if (invitations.status === "Idle") {
          setInvitations("status", "Fetching");
          try {
            const resp = await listInvitations({
              page_id: invitations.pageId,
              page_size: invitations.pageSize,
            });
            setInvitations(
              produce((s) => {
                s.data = resp.invitations;
                s.total = resp.total;
                s.status = "Done";
              })
            );
          } catch (err) {
            setInvitations(
              produce((s) => {
                s.data = [];
                s.total = 0;
                s.status = "Failed";
              })
            );
          }
        }
      }
    )
  );

  return { invitations, pageInfo, pageDown, pageUp, reload };
};

export const useDeleteInvitations = (cb: Accessor<void>) => {
  const [_, { setToast }] = useAppContext();
  const deleteInvitations = useFetchPrivate(DeleteInvitationsConfig);

  const handleDeleteInvitations = async (code: string) => {
    try {
      await deleteInvitations({ codes: [code] });
      cb();
    } catch (err) {
      if (err instanceof Error) {
        err.message && setToast(err.message, "error");
      }
    }
  };

  return handleDeleteInvitations;
};

export const useCreateInvitation = (cb: Accessor<void>) => {
  const [_, { setToast }] = useAppContext();
  const createInvitation = useFetchPrivate(CreateInvitationConfig);

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({ length: 0, days: 0 });

  const handleCreateInvitation: JSX.EventHandler<HTMLFormElement, Event> = async (ev) => {
    ev.preventDefault();
    if (!fields.length || !fields.days) return;

    setLoading(true);
    try {
      const { invitation } = await createInvitation({
        length: fields.length,
        days: fields.days,
      });
      setToast(`Create sucessfully, ${invitation.code}`, "success");
      cb();
    } catch (err) {
      if (err instanceof Error) {
        err.message && setToast(err.message, "error");
      }
    }
    setLoading(false);
  };

  return { loading, setFields, handleCreateInvitation };
};
