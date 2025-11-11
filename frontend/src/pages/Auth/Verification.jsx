import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verify } from "../../api/user";
import { Button, AuthImage } from "../../components/index";
import { handleApiResponse, handleApiError } from "../../utils";

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
      const { status, message } = handleApiResponse(response);

      if (status === 201 || status === 200) {
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setStatus("Resend Verification Link");
      }
    } catch (e) {
      console.error("Verification error", e);
      handleApiError(e, "Something went wrong!");
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
            <Button
              onClick={() => navigate("/resend-verify")}
            >
              Resend Verification Email
            </Button>
          )}
        </div>
      </div>

      <AuthImage />
    </div>
  );
};

export default Verification;
