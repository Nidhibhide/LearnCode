import React, { useState } from "react";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
const Content = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLinkClick = () => {
    setShowSidebar(false);
  };

  return (
    <div className="flex w-full h-screen">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:hidden absolute top-4 left-4 z-50">
            <button onClick={() => setShowSidebar(true)} className="p-2 bg-black text-white rounded-md">
              <IoMenu size={24} />
            </button>
          </div>
      {/* ✅ Sidebar overlay for small screens */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar slides in from the left */}
          <div className="w-full sm:w-96 md:w-72 min-w-[320px] h-full relative">
            <Sidebar onLinkClick={handleLinkClick} />
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-white z-50 p-2 bg-black rounded-md"
              onClick={() => setShowSidebar(false)}
            >
              <IoCloseSharp size={24} />
            </button>
          </div>

          {/* Transparent overlay to close sidebar when clicked outside */}
          <div
            className="flex-1"
            onClick={() => setShowSidebar(false)}
          />
        </div>
      )}

      {/*  Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Content;
