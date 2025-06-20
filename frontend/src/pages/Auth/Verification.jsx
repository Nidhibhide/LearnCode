import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { codingImage } from "../../images/index";
import { toast } from "react-toastify";
import { verify } from "../../api/user";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(
    "Email Verified. Redirecting to Login..."
  );

  const token = searchParams.get("token");

  const verifyUser = async () => {
    try {
      const response = await verify(token);
      const { message, statusCode } = response;

      if (statusCode === 201 || statusCode === 200) {
        toast.success(message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(message);
        setStatus("Resend Verification Link");
      }
    } catch (e) {
      console.error("Verification error", e);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    verifyUser();
  }, [token, navigate]);

  return (
    <div className="h-screen flex bg-slate-200">
      <div className="lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4 md:px-12 bg-white">
        <div className="h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-6 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-2xl md:text-3xl mb-14">{status}</p>
          {status !== "Email Verified. Redirecting to Login..." && (
            <button
              type="button"
              className="bg-black text-white py-3 font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
              onClick={() => navigate("/resend-verify")}
            >
              Resend Verification Email
            </button>
          )}
        </div>
      </div>

      <div className="w-[50%] lg:block hidden">
        <img
          src={codingImage}
          className="h-full w-full object-fill rounded-tr-2xl rounded-br-2xl"
          alt="Coding"
        />
      </div>
    </div>
  );
};

export default Verification;
