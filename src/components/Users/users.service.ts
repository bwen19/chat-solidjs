import { Accessor, JSX, createEffect, createSignal, on } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useAppContext } from "@/AppContext";
import { CreateUserConfig, DeleteUserConfig, ListUsersConfig, UpdateUserConfig, UpdateUserRequest, UserInfo } from "@/api";
import usePrivateFetch from "@/utils/usePrivateFetch";

type UsersData = {
  status: "Idle" | "Fetching" | "Failed" | "Done";
  pageId: number;
  pageSize: number;
  total: number;
  data: UserInfo[];
};

export const useListUsers = () => {
  const [users, setUsers] = createStore<UsersData>({
    status: "Done",
    pageId: 1,
    pageSize: 5,
    total: 0,
    data: [],
  });

  const pageInfo = () => {
    if (!users.data) return "";
    const numStart = (users.pageId - 1) * users.pageSize + 1;
    const numEnd = Math.min(users.total, users.pageId * users.pageSize);
    return `Showing ${numStart}-${numEnd} of ${users.total}`;
  };

  const pageDown = () => {
    if (users.pageId > 1) {
      setUsers(
        produce((s) => {
          s.pageId = s.pageId - 1;
          s.status = "Idle";
        }),
      );
    }
  };

  const pageUp = () => {
    const numStart = users.pageId * users.pageSize;
    if (numStart < users.total) {
      setUsers(
        produce((s) => {
          s.pageId = s.pageId + 1;
          s.status = "Idle";
        }),
      );
    }
  };

  const listUsers = usePrivateFetch(ListUsersConfig);

  const reload = () => setUsers("status", "Idle");

  createEffect(
    on(
      () => users.status,
      async () => {
        if (users.status === "Idle") {
          setUsers("status", "Fetching");
          try {
            const resp = await listUsers({
              pageId: users.pageId,
              pageSize: users.pageSize,
            });
            setUsers(
              produce((s) => {
                s.data = resp.users;
                s.total = resp.total;
                s.status = "Done";
              }),
            );
          } catch (err) {
            setUsers(
              produce((s) => {
                s.data = [];
                s.total = 0;
                s.status = "Failed";
              }),
            );
          }
        }
      },
    ),
  );

  return { users, pageInfo, pageDown, pageUp, reload };
};

export const useDeleteUser = (cb: Accessor<void>) => {
  const [_, { setToast }] = useAppContext();
  const deleteUser = usePrivateFetch(DeleteUserConfig);

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      cb();
    } catch (err) {
      if (err instanceof Error) {
        err.message && setToast(err.message, "error");
      }
    }
  };

  return handleDeleteUser;
};

export const useCreateUser = (cb: Accessor<void>) => {
  const [_, { setToast }] = useAppContext();
  const createUser = usePrivateFetch(CreateUserConfig);

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({ username: "", password: "", role: "user" });

  const handleCreateUser: JSX.EventHandler<HTMLFormElement, Event> = async (ev) => {
    ev.preventDefault();
    if (!fields.username || !fields.password || !fields.role) return;

    setLoading(true);
    try {
      const { user } = await createUser({
        username: fields.username,
        password: fields.password,
        role: fields.role,
      });
      setToast(`Create sucessfully, ${user.username}`, "success");
      cb();
    } catch (err) {
      if (err instanceof Error) {
        err.message && setToast(err.message, "error");
      }
    }
    setLoading(false);
  };

  return { loading, setFields, handleCreateUser };
};

export const useUpdateUser = (user: UserInfo, cb: Accessor<void>) => {
  const [_, { setToast }] = useAppContext();
  const updateUser = usePrivateFetch(UpdateUserConfig);

  const [loading, setLoading] = createSignal(false);
  const [fields, setFields] = createStore({
    username: "",
    password: "",
    role: "",
    active: "",
  });

  const handleCreateUser: JSX.EventHandler<HTMLFormElement, Event> = async (ev) => {
    ev.preventDefault();

    setLoading(true);
    try {
      const req: UpdateUserRequest = {
        userId: user.id,
      };

      let npar = 0;
      if (fields.username && fields.username !== user.username) {
        req.username = fields.username;
        npar++;
      }
      if (fields.password) {
        req.password = fields.password;
        npar++;
      }
      if (fields.role && fields.role !== user.role) {
        req.role = fields.role;
        npar++;
      }
      if (fields.active) {
        const deleted = fields.active === "no" ? true : false;
        if (deleted !== user.deleted) {
          req.deleted = deleted;
          npar++;
        }
      }

      if (npar > 0) await updateUser(req);
      setToast(`Update sucessfully, ${user.username}`, "success");
      cb();
    } catch (err) {
      if (err instanceof Error) {
        err.message && setToast(err.message, "error");
      }
    }
    setLoading(false);
  };

  return { loading, setFields, handleCreateUser };
};
