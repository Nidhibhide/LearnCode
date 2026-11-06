import React, { useState, useEffect } from "react";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Logout from "../Logout";

const SIDEBAR_COLLAPSED_KEY = "learncode_sidebar_collapsed";

const Content = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
    } catch {
      // ignore storage errors
    }
  }, [collapsed]);

  const handleLinkClick = () => {
    setShowSidebar(false);
  };

  const handleLogoutClick = () => {
    setShowSidebar(false);
    setShowLogout(true);
  };

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar - visible on xl (1280px) and above */}
      <div className="hidden xl:block h-full flex-shrink-0">
        <Sidebar
          onLogoutClick={handleLogoutClick}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Mobile menu button - only visible below xl (1280px) */}
      <div className="xl:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 bg-black text-white rounded-md"
        >
          <IoMenu size={24} />
        </button>
      </div>
      {/* Mobile sidebar overlay - only below xl (1280px); always expanded */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex xl:hidden">
          {/* Sidebar slides in from the left */}
          <div className="w-72 h-full relative">
            <Sidebar
              onLinkClick={handleLinkClick}
              onLogoutClick={handleLogoutClick}
            />
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-white z-50 p-2 bg-black rounded-md"
              onClick={() => setShowSidebar(false)}
            >
              <IoCloseSharp size={24} />
            </button>
          </div>

          {/* Transparent overlay to close sidebar when clicked outside */}
          <div className="flex-1" onClick={() => setShowSidebar(false)} />
        </div>
      )}

      {/*  Main Content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <Outlet />
      </div>

      <Logout isOpen={showLogout} onOpenChange={setShowLogout} />
    </div>
  );
};

export default Content;
