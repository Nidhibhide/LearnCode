import React from "react";
import { adminImage } from "../../../images";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { MdOutlineRestore } from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = () => {
  //get user detail
  const data = JSON.parse(localStorage.getItem("data"));
  return (
    <div className="w-72 h-full">
      <div className="w-full h-full flex flex-col text-white ">
        <div className="h-[150px] bg-blue-950 flex justify-center items-center gap-4 ">
          <div className="   ">
            <img
              className=" object-fill rounded-full  w-24 h-20 "
              src={adminImage}
            />
          </div>
          <div className=" flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold">{data?.name}</h1>
            <p className="text-lg font-medium text-green-500">{data?.role}</p>
          </div>
        </div>
        <div className="h-full bg-black py-6">
          <ul className=" flex  flex-col   text-xl font-medium ">
            <li className="flex  items-center gap-2 cursor-pointer hover:bg-[#a9a9a9] py-4 justify-center">
              <Link
                to="/dashboard/viewTest"
                className="flex items-center justify-center gap-2 "
              >
                <MdOutlineRemoveRedEye size={28} />
                View Tests
              </Link>
            </li>
            <li className="flex items-center gap-1 cursor-pointer hover:bg-[#a9a9a9] py-4 justify-center">
              <Link
                to="/dashboard/createTest"
                className="flex items-center justify-center gap-2"
              >
                <IoMdAdd className="text-2xl" size={28} /> Create Test
              </Link>
            </li>
            <li className="flex items-center gap-1 cursor-pointer hover:bg-[#a9a9a9] py-4 justify-center">
              <Link
                to="/dashboard/createTest"
                className="flex items-center justify-center gap-2"
              >
                <MdOutlineRestore className="text-2xl" size={28} /> Restore
                Tests
              </Link>
            </li>

            <li className="flex  items-center gap-2 cursor-pointer hover:bg-[#a9a9a9] py-4 justify-center">
              <Link
                to="/dashboard/setting"
                className="flex items-center justify-center gap-2"
              >
                <IoSettingsSharp size={28} />
                Setting
              </Link>
            </li>
            <li className="flex  items-center gap-2 cursor-pointer hover:bg-[#a9a9a9] py-4 justify-center">
              <Link
                to="/dashboard/logout"
                className="flex items-center justify-center gap-2"
              >
                <MdOutlineLogout size={28} />
                LogOut
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
