import globalaxios from "../globalaxios";

//signup api

export const signup = async (data) => {
  try {
    const res = await globalaxios.post("/user/register", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
