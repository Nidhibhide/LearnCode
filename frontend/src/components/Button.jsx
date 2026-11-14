import React from "react";

const Button = ({
  loading,
  children,
  loadingText = "Loading...",
  className = "bg-black text-white py-3 font-medium rounded-xl mb-2 md:mb-4",
  width = "",
  disabled,
  onMouseDown,
  onClick,
  ...props
}) => {
  const isDisabled = loading || disabled;

  return (
    <button
      type="button"
      className={`${className} ${width} transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
      disabled={isDisabled}
      onMouseDown={(e) => {
        // Keep focus on inputs so password-rules layout shift doesn't eat the click
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        // Close password rules after the click is handled
        queueMicrotask(() => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        });
      }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
