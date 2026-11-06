import { useState } from "react";
import { FaClipboard } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoMdNotifications } from "react-icons/io";
import {
  MdOutlineRemoveRedEye,
  MdOutlineLogout,
  MdOutlineAnalytics,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ConfirmationDialog } from "../../../components/index";

// Define parent-child route relationships for active state
const parentChildRoutes = {
  "/dashboard/assessments": [
    "/dashboard/questionsList",
    "/dashboard/TestLayout",
    "/dashboard/rules",
  ],
  "/dashboard/viewTest": [
    "/dashboard/viewTest/createTest",
    "/dashboard/viewTest/editTest",
    "/dashboard/viewTest/deleteTest",
  ],
  "/dashboard/setting": [
    "/dashboard/setting/changePassword",
    "/dashboard/setting/editProfile",
    "/dashboard/restoreTest",
  ],
};

const Sidebar = ({
  onLinkClick,
  onLogoutClick,
  collapsed = false,
  onToggleCollapse,
}) => {
  const user = useSelector((state) => state.user);
  const role = user?.role;
  const name = user?.name;
  const location = useLocation();
  const navigate = useNavigate();

  const isTakingTest = location.pathname.startsWith("/dashboard/TestLayout");
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const [pendingLogout, setPendingLogout] = useState(false);

  // Helper function to check if a route or its children are active
  const isRouteActive = (routePath) => {
    if (location.pathname === routePath) return true;
    const childRoutes = parentChildRoutes[routePath];
    if (childRoutes) {
      return childRoutes.some((child) => location.pathname.startsWith(child));
    }
    return false;
  };

  const closeMobileSidebar = () => {
    if (onLinkClick) onLinkClick();
  };

  const openLeaveDialog = ({ path = null, logout = false } = {}) => {
    setPendingPath(path);
    setPendingLogout(logout);
    setLeaveOpen(true);
    closeMobileSidebar();
  };

  const handleNavClick = (e, path) => {
    if (isTakingTest) {
      e.preventDefault();
      openLeaveDialog({ path });
      return;
    }
    closeMobileSidebar();
  };

  const handleLogoutClick = () => {
    if (isTakingTest) {
      openLeaveDialog({ logout: true });
      return;
    }
    closeMobileSidebar();
    if (onLogoutClick) onLogoutClick();
  };

  const handleConfirmLeave = () => {
    setLeaveOpen(false);
    if (pendingLogout) {
      if (onLogoutClick) onLogoutClick();
    } else if (pendingPath) {
      navigate(pendingPath);
    }
    setPendingPath(null);
    setPendingLogout(false);
  };

  const handleLeaveOpenChange = (open) => {
    setLeaveOpen(open);
    if (!open) {
      setPendingPath(null);
      setPendingLogout(false);
    }
  };

  const unreadNotifications = useSelector(
    (state) => state.notifications.unreadNotifications
  );
  const unreadCount = unreadNotifications?.length || 0;
  const sidebarLinks = [
    {
      to: "/dashboard/adminDashboard",
      label: "Admin Dashboard",
      icon: <MdOutlineAnalytics size={28} />,
      roles: ["admin"],
    },
    {
      to: "/dashboard/viewTest",
      label: "View Tests",
      icon: <MdOutlineRemoveRedEye size={28} />,
      roles: ["admin"],
    },
    {
      to: "/dashboard/assessments",
      label: "Assessments",
      icon: <FaClipboard size={28} />,
      roles: ["student"],
    },
    {
      to: "/dashboard/myScores",
      label: "My Progress",
      icon: <GiCheckMark size={28} />,
      roles: ["student"],
    },
    {
      to: "/dashboard/notifications",
      label: "Notifications",
      icon: <IoMdNotifications size={28} />,
      roles: ["student", "admin"],
      showDot: unreadCount > 0,
    },
    {
      to: "/dashboard/setting",
      label: "Setting",
      icon: <IoSettingsSharp size={28} />,
      roles: ["admin", "student"],
    },
  ];

  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.includes(role)
  );

  const navClass = (active) =>
    active
      ? `flex items-center ${collapsed ? "justify-center" : "justify-center gap-2"} text-sm sm:text-base md:text-lg lg:text-xl w-full bg-surface text-sidebar font-semibold py-2.5 rounded-md`
      : `flex items-center ${collapsed ? "justify-center" : "justify-center gap-2"} text-sm sm:text-base md:text-lg lg:text-xl w-full text-sidebarText hover:bg-sidebarHover py-2.5 rounded-md`;

  return (
    <div
      className={`h-full transition-all duration-300 ${
        collapsed ? "w-20" : "w-full xl:w-72"
      }`}
    >
      <div className="w-full h-full flex flex-col text-white">
        {/* Profile Section */}
        <div
          className={`bg-sidebar flex justify-center items-center gap-2 sm:gap-4 px-2 ${
            collapsed
              ? "h-[90px] flex-col"
              : "h-[120px] sm:h-[150px] flex-col md:flex-row px-4"
          }`}
        >
          <div
            className={`rounded-full bg-warning flex justify-center items-center flex-shrink-0 ${
              collapsed ? "w-10 h-10" : "w-12 h-12 sm:w-16 sm:h-16"
            }`}
            title={name || "Profile"}
          >
            <span
              className={`font-bold text-dark-gray ${
                collapsed ? "text-xl" : "text-2xl sm:text-3xl"
              }`}
            >
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>

          {!collapsed && (
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold capitalize text-white">
                {name?.split(" ")[0]}
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-medium text-success">
                {role?.toUpperCase()}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 bg-sidebar py-3 sm:py-4 md:py-6 overflow-y-auto flex flex-col">
          <ul className="flex flex-col text-lg sm:text-xl font-medium">
            {filteredLinks.map((link) => (
              <li
                key={link.to}
                className="flex items-center gap-2 cursor-pointer py-1 sm:py-2 px-2"
              >
                <NavLink
                  to={link.to}
                  title={typeof link.label === "string" ? link.label : ""}
                  className={() => navClass(isRouteActive(link.to))}
                  onClick={(e) => handleNavClick(e, link.to)}
                >
                  <span className="flex-shrink-0 relative">
                    {link.icon}
                    {link.showDot && collapsed && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-error rounded-full" />
                    )}
                  </span>
                  {!collapsed && (
                    <span className="truncate flex items-center gap-1">
                      {link.label}
                      {link.showDot && (
                        <span className="w-2.5 h-2.5 bg-error rounded-full ml-1" />
                      )}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
            <li className="flex items-center gap-2 cursor-pointer py-1 sm:py-2 px-2">
              <button
                type="button"
                title="Logout"
                className={navClass(false)}
                onClick={handleLogoutClick}
              >
                <span className="flex-shrink-0">
                  <MdOutlineLogout size={28} />
                </span>
                {!collapsed && <span className="truncate">Logout</span>}
              </button>
            </li>
          </ul>

          {/* Same spot open or collapsed — bottom of sidebar */}
          {onToggleCollapse && (
            <div className="mt-auto flex justify-center px-2 pt-4 pb-3">
              <button
                type="button"
                onClick={onToggleCollapse}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={`flex items-center justify-center gap-2 p-2 rounded-md bg-black/30 hover:bg-black/50 text-white w-full ${
                  collapsed ? "" : "max-w-[140px]"
                }`}
              >
                {collapsed ? (
                  <MdKeyboardDoubleArrowRight size={22} />
                ) : (
                  <>
                    <MdKeyboardDoubleArrowLeft size={22} />
                    <span className="text-sm font-medium">Collapse</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={leaveOpen}
        onOpenChange={handleLeaveOpenChange}
        title="Leave test?"
        message="Your code for this question is saved. Submitted answers are kept. You can continue later from Ongoing."
        onConfirm={handleConfirmLeave}
        confirmText="Leave"
        cancelText="Stay"
        confirmColor="danger"
        navigateOnClose={false}
      />
    </div>
  );
};

export default Sidebar;
