
import { Link } from "react-router-dom";
import { FaClipboard } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import {
  MdOutlineRemoveRedEye,
  MdOutlineLogout,
  MdOutlineRestore,
} from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { adminImage } from "../../../images"; 

const Sidebar = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const role = data?.role;

  // Sidebar links defined inside the same file
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
          <img
            className="object-fill rounded-full w-24 h-20"
            src={adminImage}
            alt="profile"
          />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold">{data?.name}</h1>
            <p className="text-lg font-medium text-green-500">{role}</p>
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
