import React, { useState } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { PasswordRules } from "./index";

const InputField = ({
  label,
  name,
  type = "text",
  as = "input",
  placeholder,
  options = [],
  onChange,
  onFocus,
  onBlur,
  radioOptions = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const formikContext = useFormikContext();

  // Get the actual field value from Formik if available
  const fieldValue = formikContext?.values?.[name] || "";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
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
      ) : as === "radio" ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            {radioOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 w-full ${
                  fieldValue === option.value
                    ? "border-blue bg-blue/10"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Field
                  type="radio"
                  name={name}
                  value={option.value}
                  className="w-4 h-4 text-blue"
                />
                {option.icon && <span className="text-xl">{option.icon}</span>}
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
          <ErrorMessage
            name={name}
            component="p"
            className="text-sm text-red-500"
          />
        </div>
      ) : (
        <>
          <div className="relative">
            <Field
              name={name}
              type={type === "password" ? (showPassword ? "text" : "password") : type}
              placeholder={placeholder}
              className="md:py-3 md:px-4 py-2 px-2 pr-10 rounded-lg border border-gray-300 placeholder:text-base w-full"
              onFocus={onFocus}
              onBlur={onBlur}
              onMouseEnter={() => type === "password" && setIsHovered(true)}
              onMouseLeave={() => type === "password" && setIsHovered(false)}
            >
              {({ field }) => (
                <input
                  {...field}
                  type={type === "password" ? (showPassword ? "text" : "password") : type}
                  placeholder={placeholder}
                  className="md:py-3 md:px-4 py-2 px-2 pr-10 rounded-lg border border-gray-300 placeholder:text-base w-full"
                  onChange={(e) => {
                    field.onChange(e);
                    if (onChange) onChange(e);
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              )}
            </Field>
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
          {type === "password" && <PasswordRules isVisible={isHovered || isFocused} password={fieldValue} />}
        </>
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
