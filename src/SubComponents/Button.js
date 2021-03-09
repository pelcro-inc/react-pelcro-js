import React from "react";
import { ReactComponent as SpinnerIcon } from "../assets/spinner.svg";

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
      )} pelcro-button-${variant} ${className}`}
      disabled={disabled || isLoading}
      {...otherProps}
    >
      {isLoading && (
        <SpinnerIcon
          className="w-5 h-5 mr-2 animate-spin pelcro-button-spinner"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        />
      )}
      {!isLoading && <div className="mr-2">{icon}</div>}
      {children}
    </button>
  );
}

const getClassName = (variant, isFullWidth, disabled) => {
  const variantsClasses = {
    solid: `inline-flex items-center justify-center px-6 py-2 font-semibold tracking-wider text-white uppercase bg-primary-500 rounded focus:outline-none focus:ring-4 focus:ring-primary-300 text-md justify-items-center ${
      disabled ? "" : "hover:bg-primary-600"
    } disabled:bg-gray-400 disabled:cursor-not-allowed ${
      isFullWidth ? "w-full" : "w-max"
    }`,

    outline: `inline-flex items-center justify-center px-6 py-2 font-semibold uppercase text-primary-500 border border-primary-500 rounded focus:outline-none focus:ring-4 focus:ring-primary-300 text-md justify-items-center ${
      disabled ? "" : "hover:bg-primary-600 hover:text-white"
    } tracking-wider disabled:text-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed ${
      isFullWidth ? "w-full" : "w-max"
    }`,

    icon: `w-8 h-8 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300 ${
      disabled ? "" : "hover:bg-primary-100 hover:text-primary-600"
    }`,

    ghost: `inline-flex items-center justify-center p-1 text-xs font-semibold text-primary-400 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 justify-items-center ${
      disabled ? "text-gray-500" : "hover:bg-primary-50"
    } 
    ${isFullWidth ? "w-full" : "w-max"}`
  };

  return variantsClasses[variant];
};
