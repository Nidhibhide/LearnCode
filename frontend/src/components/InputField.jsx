import React, { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const InputField = ({
  label,
  name,
  type = "text",
  as = "input",
  placeholder,
  options = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col space-y-1">
      <p className="md:text-lg text-base font-medium">{label}</p>
      {as === "select" ? (
        <Field
          as="select"
          name={name}
          className="md:py-3 md:px-4 py-2 px-2 rounded-lg border border-gray-300 "
        >
          <option value="" disabled>
            Select {label.toLowerCase()}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </Field>
      ) : (
        <div className="relative">
          <Field
            as={as}
            name={name}
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            className="md:py-3 md:px-4 py-2 px-2 pr-10 rounded-lg border border-gray-300 placeholder:text-base w-full"
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          )}
        </div>
      )}
      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-red-500"
      />
    </div>
  );
};

export default InputField;
