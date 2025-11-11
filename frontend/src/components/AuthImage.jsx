import React from "react";
import { codingImage } from "../images/index";

const AuthImage = () => {
  return (
    <div className="w-[50%] lg:block hidden">
      <img
        src={codingImage}
        className="h-full w-full object-fill rounded-tr-2xl rounded-br-2xl"
        alt="Coding"
      />
    </div>
  );
};

export default AuthImage;