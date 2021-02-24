import React from "react";
import { ReactComponent as ErrorIcon } from "../assets/error.svg";
import { ReactComponent as SuccessIcon } from "../assets/check.svg";
import { ReactComponent as CloseIcon } from "../assets/x-icon.svg";

export function Alert({
  type = "error",
  className = "",
  onClose,
  children,
  ...otherProps
}) {
  return (
    <div
      className={`inline-flex items-center justify-between px-4 py-3 pr-1 w-full font-semibold text-sm text-white ${
        type === "error" ? "bg-red-500" : "bg-primary-500"
      } rounded-sm pelcro-alert-${type} ${className}`}
      {...otherProps}
    >
      <div className="inline-flex items-center">
        {type === "error" && (
          <ErrorIcon className="flex-shrink-0 w-6 mr-3 pelcro-alert-icon" />
        )}
        {type === "success" && (
          <SuccessIcon
            className="flex-shrink-0 w-6 mr-3 pelcro-alert-icon"
            fill="currentColor"
          />
        )}
        <div className="pelcro-alert-content">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="flex-shrink-0 w-6 text-white hover:text-gray-300 pelcro-modal-close pelcro-alert-close-btn"
          aria-label="close modal"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
