import { FaClipboard } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { IoMdNotifications } from "react-icons/io";
import {
  MdOutlineRemoveRedEye,
  MdOutlineLogout,
  MdOutlineAnalytics,
} from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

// Define parent-child route relationships for active state
const parentChildRoutes = {
  "/dashboard/assessments": [
    "/dashboard/questionsList", 
    "/dashboard/TestLayout", 
    "/dashboard/rules"
  ],
  "/dashboard/viewTest": [
    "/dashboard/viewTest/createTest", 
    "/dashboard/viewTest/editTest", 
    "/dashboard/viewTest/deleteTest"
  ],
  "/dashboard/setting": [
    "/dashboard/setting/changePassword", 
    "/dashboard/setting/editProfile",
    "/dashboard/restoreTest"
  ],
};

const Sidebar = ({ onLinkClick }) => {
  const user = useSelector((state) => state.user);
  const role = user?.role;
  const name = user?.name;
  const location = useLocation();

  // Helper function to check if a route or its children are active
  const isRouteActive = (routePath) => {
    if (location.pathname === routePath) return true;
    const childRoutes = parentChildRoutes[routePath];
    if (childRoutes) {
      return childRoutes.some(child => location.pathname.startsWith(child));
    }
    return false;
  };

  // Click handler
  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
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
      label: (
        <span className="flex items-center gap-1">
          Notifications
          {unreadCount > 0 && (
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full ml-1"></span>
          )}
        </span>
      ),
      icon: <IoMdNotifications size={28} />,
      roles: ["student", "admin"],
    },
    {
      to: "/dashboard/setting",
      label: "Setting",
      icon: <IoSettingsSharp size={28} />,
      roles: ["admin", "student"],
    },
    {
      to: "/dashboard/logout",
      label: "Logout",
      icon: <MdOutlineLogout size={28} />,
      roles: ["admin", "student"],
    },
  ];

  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.includes(role)
  );

  return (
    <div className="w-full xl:w-72 h-full">
      <div className="w-full h-full flex flex-col text-white">
        {/* Profile Section */}
        <div className="h-[120px] sm:h-[150px] bg-blue-950 flex flex-col md:flex-row justify-center items-center gap-2 sm:gap-4 px-4 relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-500 flex justify-center items-center">
            <span className="text-2xl sm:text-3xl font-bold text-dark-gray">
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold capitalize text-white">
              {name?.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-green-500">
              {role.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="h-screen bg-black py-3 sm:py-4 md:py-6 overflow-y-auto">
          <ul className="flex flex-col text-lg sm:text-xl font-medium">
            {filteredLinks.map((link) => (
              <li
                key={link.to}
                className="flex items-center gap-2 cursor-pointer py-1 sm:py-2 px-2"
              >
                <NavLink
                  to={link.to}
                  className={() => isRouteActive(link.to) ? "flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl w-full bg-white text-black font-semibold py-2.5" : "flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl w-full text-white hover:bg-gray-700 py-2.5"}
                  onClick={handleLinkClick}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  <span className="truncate">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
