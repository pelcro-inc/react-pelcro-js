import React from "react";
import { ReactComponent as ErrorIcon } from "../assets/error.svg";
import { ReactComponent as SuccessIcon } from "../assets/check.svg";

export function Alert({
  type = "error",
  className = "",
  hideIcon = false,
  children,
  ...otherProps
}) {
  return (
    <div
      className={`inline-flex items-center p-5 w-full font-semibold text-white ${
        type === "error" ? "bg-red-500" : "bg-primary-500"
      } rounded-sm pelcro-alert-${type} ${className}`}
      {...otherProps}
    >
      {type === "error" && !hideIcon && (
        <ErrorIcon
          className="w-6 mr-3 pelcro-alert-icon"
          stroke="currentColor"
          fill="none"
        />
      )}
      {type === "success" && !hideIcon && (
        <SuccessIcon
          className="w-6 mr-3 pelcro-alert-icon"
          fill="currentColor"
        />
      )}
      <div className="pelcro-alert-content">{children}</div>
    </div>
  );
}
