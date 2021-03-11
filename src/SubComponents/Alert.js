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
      className={`plc-inline-flex plc-items-center plc-justify-between plc-px-4 plc-py-3 plc-pr-1 plc-w-full plc-font-semibold plc-text-sm plc-text-white ${
        type === "error" ? "plc-bg-red-500" : "plc-bg-primary-500"
      } plc-rounded-sm pelcro-alert-${type} ${className}`}
      {...otherProps}
    >
      <div className="plc-inline-flex plc-items-center">
        {type === "error" && (
          <ErrorIcon className="plc-flex-shrink-0 plc-w-6 plc-mr-3 pelcro-alert-icon" />
        )}
        {type === "success" && (
          <SuccessIcon
            className="plc-flex-shrink-0 plc-w-6 plc-mr-3 pelcro-alert-icon"
            fill="currentColor"
          />
        )}
        <div className="pelcro-alert-content">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="plc-flex-shrink-0 plc-w-6 plc-text-white hover:plc-text-gray-300 pelcro-modal-close pelcro-alert-close-btn"
          aria-label="close modal"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
