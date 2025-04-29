import React from "react";
import { Link } from "react-router-dom";
import { codingImage } from "../../images/index";

const SignUp = () => {
  return (
    <div className="h-screen flex  bg-slate-200">
      <div className=" lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4  md:px-12 bg-white ">
        <div className=" h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-12 mb-8">
            LearnCode
          </p>
          <p className="font-semibold text-2xl md:text-3xl mb-14">
            {" "}
            Welcome to LearnCode! Please sign up to start your coding journey.
          </p>

          {/* form */}
          <div className="flex flex-col space-y-4 mb-12">
            <div className="flex flex-col space-y-1">
              <p className="text-base font-medium">Email</p>
              <input
                type="email"
                name="email"
                className="py-3 px-4 rounded-lg border border-gray-300"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-base font-medium">Password</p>
              <input
                type="password"
                name="password"
                className="py-3 px-4 rounded-lg border border-gray-300"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button className="bg-black text-white py-3 font-medium rounded-xl md:mb-4 mb-2">
            Sign In
          </button>
          <p className="md:text-lg text-base ">
            Forgot Password?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Click Here
            </Link>
          </p>
        </div>
      </div>
      <div className=" w-[50%] lg:block hidden ">
        <img
          src={codingImage}
          className="h-full w-full object-fill rounded-tr-2xl rounded-br-2xl"
        />
      </div>
    </div>
  );
};

export default SignUp;
