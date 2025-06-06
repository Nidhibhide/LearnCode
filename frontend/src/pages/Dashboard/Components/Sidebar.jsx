import React, { useEffect, useState } from "react";
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
const Sidebar = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const role = data?.role;
  const name = data?.name;

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
            <span className="absolute -top-3 -right-4 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
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
    <div className="w-72 h-full">
      <div className="w-full h-full flex flex-col text-white">
        {/* Profile Section */}
        <div className="h-[150px] bg-blue-950 flex justify-center items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex justify-center items-center ">
            <span className="text-3xl font-bold text-blue-950">
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold capitalize">{name}</h1>
            <p className="text-base font-medium text-green-500">
              {role.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="h-full bg-black py-6">
          <ul className="flex flex-col text-xl font-medium">
            {filteredLinks.map((link) => (
              <li
                key={link.to}
                className="flex items-center gap-2 cursor-pointer hover:bg-[#a9a9a9] py-4 justify-center"
              >
                <Link to={link.to} className="flex items-center gap-2">
                  {link.icon}
                  {link.label}
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
