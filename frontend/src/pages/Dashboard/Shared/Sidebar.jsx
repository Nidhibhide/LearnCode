import { FaClipboard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoMdAdd, IoMdNotifications } from "react-icons/io";
import { IoStatsChartSharp } from "react-icons/io5";
import {
  MdOutlineRemoveRedEye,
  MdOutlineLogout,
  MdOutlineRestore,
} from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { getUserData, getUserRole, getUserName } from "../../../utils";

const Sidebar = ({ onLinkClick }) => {
  const data = getUserData();
  const role = getUserRole();
  const name = getUserName();

  const unreadCount = useSelector(
    (state) => state.notifications.notificationCount
  );
  const sidebarLinks = [
    {
      to: "/dashboard/viewTest",
      label: "View Tests",
      icon: <MdOutlineRemoveRedEye size={28} />,
      roles: ["admin"],
    },
    {
      to: "/dashboard/createTest",
      label: "Create Test",
      icon: <IoMdAdd size={28} />,
      roles: ["admin"],
    },
    {
      to: "/dashboard/restoreTest",
      label: "Restore Tests",
      icon: <MdOutlineRestore size={28} />,
      roles: ["admin"],
    },
    {
      to: "/dashboard/assessments",
      label: "Assessments",
      icon: <FaClipboard size={28} />,
      roles: ["user"],
    },
    {
      to: "/dashboard/myScores",
      label: "My Scores",
      icon: <GiCheckMark size={28} />,
      roles: ["user"],
    },
    {
      to: "/dashboard/notifications",
      label: (
        <span className="relative flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="absolute -top-3 -right-4 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </span>
      ),
      icon: <IoMdNotifications size={28} />,
      roles: ["user", "admin"],
    },
    {
      to: "/dashboard/userAttempts",
      label: "User Attempts",
      icon: <IoStatsChartSharp size={28} />,
      roles: ["admin"],
    },
    {
      to: "/dashboard/setting",
      label: "Setting",
      icon: <IoSettingsSharp size={28} />,
      roles: ["admin", "user"],
    },
    {
      to: "/dashboard/logout",
      label: "Logout",
      icon: <MdOutlineLogout size={28} />,
      roles: ["admin", "user"],
    },
  ];

  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.includes(role)
  );

  return (
    <div className="w-full sm:w-96 md:w-72 min-w-[320px] h-full">
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
        <div className="h-full bg-black py-3 sm:py-4 md:py-6 overflow-y-auto">
          <ul className="flex flex-col text-lg sm:text-xl font-medium">
            {filteredLinks.map((link) => (
              <li
                key={link.to}
                className="flex items-center gap-2 cursor-pointer hover:bg-dark-gray-hover py-2 sm:py-3 px-2 justify-center"
              >
                <Link
                  to={link.to}
                  className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl text-white w-full"
                  onClick={onLinkClick}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  <span className="truncate">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
