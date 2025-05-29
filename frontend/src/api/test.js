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
export const GetDeletedAll = async (filters) => {
  try {
    const res = await globalaxios.get("/test/get-deleted-All", {
      params: filters,
    });
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const deleteTest = async (id) => {
  try {
    const res = await globalaxios.put(`/test/delete/${id}`);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const edit = async (id, data) => {
  try {
    const res = await globalaxios.put(`/test/edit/${id}`, data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const restore = async (id) => {
  try {
    const res = await globalaxios.put(`/test/restore/${id}`);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const getAllOngoing = async (filters, user) => {
  try {
    const res = await globalaxios.get(`/test/getOngoing/${user}`, {
      params: filters,
    });
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
