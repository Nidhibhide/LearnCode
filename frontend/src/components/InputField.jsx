import React from "react";
import { Field, ErrorMessage } from "formik";

const InputField = ({
  label,
  name,
  type = "text",
  as = "input",
  placeholder,
  options = [],
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <p className="md:text-base text-sm font-medium">{label}</p>
      {as === "select" ? (
        <Field
          as="select"
          name={name}
          className="py-3 px-4 rounded-lg border border-gray-300"
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
        <Field
          as={as}
          name={name}
          type={type}
          placeholder={placeholder}
          className="md:py-3 md:px-4 py-2 px-2 rounded-lg border border-gray-300"
        />
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
