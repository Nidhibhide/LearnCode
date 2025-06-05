import { globalaxios } from "../globals";

export const getAllByUser = async (filters, user) => {
  try {
    const res = await globalaxios.get(`/notification/getAll/${user}`, {
      params: filters,
    });
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const markAsread = async (id) => {
  try {
    const res = await globalaxios.put(`/notification/update/${id}`);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
