import React, { useState } from "react";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
const Content = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex w-full h-screen">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button onClick={() => setShowSidebar(true)}>
          <IoMenu size={24} />
        </button>
      </div>

      {/* ✅ Sidebar overlay for small screens */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar slides in from the left */}
          <div className="w-72 bg-black h-full">
            <Sidebar />
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white z-50"
            onClick={() => setShowSidebar(false)}
          >
            <IoCloseSharp size={28} />
          </button>

          {/* Transparent overlay to close sidebar when clicked outside */}
          <div
            className="flex-1 bg-black bg-opacity-40 "
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
