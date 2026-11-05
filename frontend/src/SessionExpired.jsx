import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "./api/user";
import { clearUser } from "./redux/features/userSlice";

const SessionExpired = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleGoToLogin = async () => {
    if (loading) return;
    try {
      setLoading(true);
      // Clear cookies so Login (GuestOnly) won't revive an old session
      await logout();
    } catch {
      // Still continue to login even if logout API fails
    } finally {
      dispatch(clearUser());
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-surface p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-error mb-4">Session Expired</h1>
        <p className="text-textPrimary mb-6">
          Your session has expired. Please log in again.
        </p>
        <button
          type="button"
          onClick={handleGoToLogin}
          disabled={loading}
          className="bg-primary hover:bg-primaryDark text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Go to Login"}
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
