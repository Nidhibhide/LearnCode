import { useState, useEffect } from "react";

const MIN_WIDTH = 1024;

const DesktopOnly = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= MIN_WIDTH : true
  );

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= MIN_WIDTH);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-6">
        <div className="bg-surface p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold text-textPrimary mb-4">
            Desktop Only
          </h1>
          <p className="text-textSecondary mb-2">
            LearnCode is designed for desktop and laptop screens.
          </p>
          <p className="text-textSecondary">
            Please open this app on a device with a wider screen (at least 1024px).
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default DesktopOnly;
