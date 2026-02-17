import React from 'react';

const Button = ({
  loading,
  children,
  loadingText = "Loading...",
  className = "bg-black text-white py-3 font-medium rounded-xl mb-2 md:mb-4 hover:bg-dark-gray-hover hover:shadow-md transition duration-500",
  width = "",
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`${className} ${width}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {loadingText}
        </div>
      ) : children}
    </button>
  );
};

export default Button;
