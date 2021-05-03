import React from "react";
import { ReactComponent as SpinnerIcon } from "../assets/spinner.svg";

const VARIANTS = {
  SOLID: "solid",
  OUTLINE: "outline",
  ICON: "icon",
  GHOST: "ghost"
};

export function Button({
  variant = "solid",
  isLoading,
  icon,
  className = "",
  disabled,
  children,
  ...otherProps
}) {
  return (
    <button
      className={`${getClassName(variant)} ${className}`}
      disabled={disabled || isLoading}
      {...otherProps}
    >
      {isLoading && (
        <SpinnerIcon
          className="pelcro-button-spinner"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        />
      )}
      {!isLoading && (
        <div
          className={`${
            variant === "icon"
              ? "plc-flex plc-items-center plc-justify-center plc-w-full"
              : "plc-mr-2"
          } plc-pointer-events-none`}
        >
          {icon}
        </div>
      )}
      {children}
    </button>
  );
}

const getClassName = (variant) => {
  switch (variant) {
    case VARIANTS.SOLID:
      return "pelcro-button-solid";
    case VARIANTS.OUTLINE:
      return "pelcro-button-outline";
    case VARIANTS.ICON:
      return "pelcro-button-icon";
    case VARIANTS.GHOST:
      return "pelcro-button-ghost";
  }
};
