import globalaxios from "../globalaxios";

export const create = async (data) => {
  try {
    const res = await globalaxios.post("/test/create", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const getAll = async (filters) => {
  try {
    const res = await globalaxios.get("/test/getAll", { params: filters });
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
