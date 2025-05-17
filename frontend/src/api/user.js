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
export const resetPass = async (data) => {
  try {
    const res = await globalaxios.put("/auth/changePass", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const verify = async (token) => {
  try {
    const res = await globalaxios.get(`/auth/verify/${token}`);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const getMe = async () => {
  try {
    const res = await globalaxios.get('/user/getMe');
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const forgotPass = async (data) => {
  try {
    const res = await globalaxios.post("/auth/forgotPass", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const resendVerify = async (data) => {
  try {
    const res = await globalaxios.post("/auth/reset-verify", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const signin = async (data) => {
  try {
    const res = await globalaxios.post("/user/login", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
