import globalaxios from "../globalaxios";

//still no use
export const generateQues = async (data) => {
  try {
    const res = await globalaxios.post("/ai/generateQue", data);
    return res;
  } catch (err) {
    return (
      err.response || { message: "Unexpected error occurred", status: 500 }
    );
  }
};
