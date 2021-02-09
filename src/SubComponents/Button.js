import React from "react";
import { ReactComponent as SpinnerIcon } from "../assets/spinner.svg";

const getClassName = (variant, isFullWidth, disabled) => {
  const variantsClasses = {
    solid: `inline-flex items-center justify-center gap-3 px-6 py-3 font-bold tracking-wider text-white uppercase bg-green-500 border border-transparent rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 text-md justify-items-center ${
      disabled ? "" : "hover:bg-green-600"
    } disabled:bg-gray-400 disabled:cursor-not-allowed ${
      isFullWidth ? "w-full" : "w-max"
    }`,
    outline: `inline-flex items-center justify-center gap-3 px-6 py-3 font-bold uppercase text-green-500 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 text-md justify-items-center ${
      disabled ? "" : "hover:bg-green-600 hover:text-white"
    } tracking-wider disabled:text-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed ${
      isFullWidth ? "w-full" : "w-max"
    }`
  };

  return variantsClasses[variant];
};

export function Button({
  variant = "solid",
  isLoading,
  icon,
  isFullWidth = false,
  className = "",
  disabled,
  children,
  ...otherProps
}) {
  return (
    <button
      className={`${getClassName(
        variant,
        isFullWidth,
        disabled
      )} pelcro-prefix-btn ${className}`}
      disabled={disabled}
      {...otherProps}
    >
      {isLoading && (
        <SpinnerIcon
          className="w-5 h-5 animate-spin"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        />
      )}
      {!isLoading && icon}
      {children}
    </button>
  );
}
