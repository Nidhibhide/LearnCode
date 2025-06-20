import {globalaxios} from "../globals";

export const create = async (data) => {
  try {
    const res = await globalaxios.post("/testAttempt/create", data);
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const update = async (id, data) => {
  try {
    const res = await globalaxios.put(`/testAttempt/update/${id}`, data);
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const getAttemptAll = async (filters) => {
  try {
    const res = await globalaxios.get("/testAttempt/getAll", {
      params: filters,
    });
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};