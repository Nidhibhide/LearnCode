import globalaxios from "../globalaxios";

export const getAllAttempts = async (filters, user) => {
  try {
    const res = await globalaxios.get(`/attempts/getAttempted/${user}`, {
      params: filters,
    });
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
