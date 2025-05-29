import globalaxios from "../globalaxios";

export const generateQues= async (data) => {
  try {
    const res = await globalaxios.post("/ai/generateQue", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};