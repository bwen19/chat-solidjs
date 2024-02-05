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
