import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { codingImage } from "../../images/index";
import { toast } from "react-toastify";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const message = searchParams.get("message");

  useEffect(() => {
    if (status === "fail") {
      toast.error(message || "Verification failed");
    }
  }, [status, message, navigate]);

  return (
    <div className="h-screen flex bg-slate-200">
      <div className="lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4 md:px-12 bg-white">
        <div className="h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-6 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-2xl md:text-3xl mb-14">
            We’ve sent a message to your email. Please check your inbox.
          </p>

          <p className="text-2xl text-red-600 font-semibold mb-4">{message}</p>

          {status === "fail" && (
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
