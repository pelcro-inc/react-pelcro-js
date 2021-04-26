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
          className="plc-w-5 plc-h-5 plc-mr-2 plc-animate-spin pelcro-button-spinner"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        />
      )}
      {!isLoading && (
        <div
          className={`${
            variant === "icon" ? "" : "plc-mr-2"
          } plc-pointer-events-none`}
        >
          {icon}
        </div>
      )}
      {children}
    </button>
  );
}

const getClassName = (variant, isFullWidth, disabled) => {
  const variantsClasses = {
    solid: `plc-inline-flex plc-items-center plc-justify-center plc-px-6 plc-py-2 plc-font-semibold plc-tracking-wider plc-text-white plc-uppercase plc-bg-primary-500 plc-rounded focus:plc-outline-none focus:plc-ring-2 focus:plc-ring-primary-300 plc-text-md plc-justify-items-center ${
      disabled ? "" : "hover:plc-bg-primary-600"
    } disabled:plc-bg-gray-400 disabled:plc-cursor-not-allowed ${
      isFullWidth ? "plc-w-full" : "plc-w-max"
    }`,

    outline: `plc-inline-flex plc-items-center plc-justify-center plc-px-6 plc-py-2 plc-font-semibold plc-uppercase plc-text-primary-500 plc-border plc-border-primary-500 plc-rounded focus:plc-outline-none focus:plc-ring-2 focus:plc-ring-primary-300 plc-text-md plc-justify-items-center ${
      disabled ? "" : "hover:plc-bg-primary-600 hover:plc-text-white"
    } plc-tracking-wider disabled:plc-text-gray-500 disabled:plc-border-gray-500 disabled:plc-cursor-not-allowed ${
      isFullWidth ? "plc-w-full" : "plc-w-max"
    }`,

    icon: `plc-flex plc-justify-center plc-items-center plc-w-8 plc-h-8 plc-p-1 plc-rounded-full focus:plc-outline-none focus:plc-ring-2 focus:plc-ring-primary-300 ${
      disabled
        ? ""
        : "hover:plc-bg-primary-100 hover:plc-text-primary-600"
    }`,

    ghost: `plc-inline-flex plc-items-center plc-justify-center plc-p-1 plc-text-xs plc-font-semibold plc-text-primary-400 plc-bg-transparent plc-rounded-lg focus:plc-outline-none focus:plc-ring-2 focus:plc-ring-primary-300 plc-justify-items-center ${
      disabled ? "plc-text-gray-500" : "hover:plc-bg-primary-50"
    } 
    ${isFullWidth ? "plc-w-full" : "plc-w-max"}`
  };

  return variantsClasses[variant];
};
