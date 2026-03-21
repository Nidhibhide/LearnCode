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
      {/* Sidebar - visible on xl (1280px) and above */}
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      {/* Mobile menu button - only visible below xl (1280px) */}
      <div className="xl:hidden absolute top-4 left-4 z-50">
            <button onClick={() => setShowSidebar(true)} className="p-2 bg-black text-white rounded-md">
              <IoMenu size={24} />
            </button>
          </div>
      {/* Mobile sidebar overlay - only below xl (1280px) */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex xl:hidden">
          {/* Sidebar slides in from the left */}
          <div className="w-72 h-full relative">
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
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Content;
