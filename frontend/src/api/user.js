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
export const ChangePass = async (data) => {
  try {
    const res = await globalaxios.put("/auth/changePassword", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
export const VerifyCurrentPassword = async (data) => {
  try {
    const res = await globalaxios.post("/auth/verifyCurrentPassword", data);
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
    const res = await globalaxios.get("/user/getMe");
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const forgotPass = async (data) => {
  try {
    const res = await globalaxios.post("/auth/forgotPassword", data);
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

export const signinwithGoogle = async (token) => {
  try {
    console.log("Token", token);
    const res = await globalaxios.post("/user/google-login", { token });
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const logout = async () => {
  try {
    const res = await globalaxios.get("/user/logout");
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const checkToken = async () => {
  try {
    const res = await globalaxios.get("/auth/checkToken");
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};

export const update = async (data, id) => {
  try {
    const res = await globalaxios.put(`/user/updateProfile/${id}`, data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
