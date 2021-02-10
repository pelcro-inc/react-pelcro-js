import React from "react";
import { ReactComponent as ErrorIcon } from "../assets/error.svg";
import { ReactComponent as SuccessIcon } from "../assets/check.svg";

export function Alert({
  type = "error",
  className = "",
  children,
  ...otherProps
}) {
  return (
    <div
      className={`inline-flex items-center p-5 w-full font-semibold text-white ${
        type === "error" ? "bg-red-800" : "bg-primary-500"
      } rounded-sm pelcro-alert pelcro-alert-${type} pelcro-prefix-error-message pelcro-prefix-alert pelcro-prefix-alert-danger ${className}`}
      {...otherProps}
    >
      {type === "error" && (
        <ErrorIcon
          className="w-6 mr-3 pelcro-alert-icon"
          stroke="currentColor"
          fill="none"
        />
      )}
      {type === "success" && (
        <SuccessIcon
          className="w-6 mr-3 pelcro-alert-icon"
          fill="currentColor"
        />
      )}
      <div className="pelcro-alert-content pelcro-prefix-error-message-text">
        {children}
      </div>
    </div>
  );
}
