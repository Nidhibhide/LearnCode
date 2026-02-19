import { globalaxios } from "../globals";

export const getAllByUser = async (filters, user) => {
  try {
    const res = await globalaxios.get(`/notification/getAll/${user}`, {
      params: filters,
    });
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const markAsread = async (userId, id) => {
  try {
    const res = await globalaxios.put(`/notification/update/${userId}?id=${id}`);
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const updateDobNotify = async (userId) => {
  try {
    const res = await globalaxios.put(`/notification/update/${userId}?profileChange=true`);
    return res.data;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
