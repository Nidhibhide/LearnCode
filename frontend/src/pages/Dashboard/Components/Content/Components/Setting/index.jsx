import { useNavigate, Outlet } from "react-router-dom";

const SettingsPage = () => {
  //get user detail
  const createdAt = JSON.parse(localStorage.getItem("data"))?.createdAt;
  const navigate = useNavigate();
  return (
    <div className="w-full  h-full shadow-lg rounded-2xl py-12 px-4">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">
        Settings
      </h1>

      <div className="space-y-4">
        <button
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-3 md:py-5 px-4  rounded-lg text-left text-base md:text-lg"
          onClick={() => {
            navigate("/dashboard/setting/changePassword");
          }}
        >
          Change Password
        </button>

        <button
          className="w-full bg-green-100 hover:bg-green-200 text-green-800 font-bold py-3 md:py-5  px-4 rounded-lg text-left md:text-lg text-base"
          onClick={() => {
            navigate("/dashboard/setting/editProfile");
          }}
        >
          Edit Profile
        </button>

        <div className="w-full bg-gray-100 text-gray-700 md:py-5  py-3 px-4 rounded-lg md:text-lg text-base">
          <span className="font-semibold">Created Account At:</span>{" "}
          {new Date(createdAt).toLocaleDateString("en-GB")}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default SettingsPage;
