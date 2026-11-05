import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmailChange } from "../../api/user";
import { Button, AuthImage } from "../../components/index";
import { handleApiResponse, handleApiError } from "../../utils";

const VerifyEmailChange = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(
    "Email changed successfully. Redirecting to Login..."
  );
  const [failed, setFailed] = useState(false);

  const token = searchParams.get("token");

  const confirmEmailChange = async () => {
    try {
      if (!token) {
        setStatus("Invalid verification link");
        setFailed(true);
        return;
      }

      const response = await verifyEmailChange(token);
      const { status: resStatus } = handleApiResponse(response);

      if (resStatus === 200) {
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setStatus("Email change failed. Link may be invalid or expired.");
        setFailed(true);
      }
    } catch (e) {
      console.error("Email change verification error", e);
      handleApiError(e, "Something went wrong!");
      setStatus("Email change failed. Please try again from Settings.");
      setFailed(true);
    }
  };

  useEffect(() => {
    confirmEmailChange();
  }, [token]);

  return (
    <div className="h-screen flex bg-background">
      <div className="xl:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4 md:px-12 bg-surface">
        <div className="h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-6 mb-4">
            LearnCode
          </p>
          <p className="font-semibold text-2xl md:text-3xl mb-14">{status}</p>
          {failed && (
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          )}
        </div>
      </div>

      <AuthImage />
    </div>
  );
};

export default VerifyEmailChange;
