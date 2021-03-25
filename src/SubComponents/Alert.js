import React from "react";
import { ReactComponent as ErrorIcon } from "../assets/error.svg";
import { ReactComponent as SuccessIcon } from "../assets/check.svg";
import { ReactComponent as CloseIcon } from "../assets/x-icon.svg";

/**
 *
 */
export function Alert({
  type = "error",
  className = "",
  onClose,
  children,
  ...otherProps
}) {
  return (
    <div
      className={`plc-flex plc-items-center plc-justify-between plc-px-4 plc-py-3 plc-w-full plc-font-semibold plc-text-sm ${
        type === "error"
          ? "plc-text-red-600  plc-bg-red-100"
          : "plc-text-green-800 plc-bg-green-200"
      } plc-rounded-sm pelcro-alert-${type} ${className}`}
      {...otherProps}
    >
      <div className="plc-inline-flex plc-items-center">
        {type === "error" && (
          <ErrorIcon className="plc-flex-shrink-0 plc-w-6 plc-h-6 plc-mr-3 plc-fill-current pelcro-alert-icon" />
        )}
        {type === "success" && (
          <SuccessIcon className="plc-flex-shrink-0 plc-w-6 plc-h-6 plc-mr-3 plc-fill-current pelcro-alert-icon" />
        )}
        <div className="plc-whitespace-pre-wrap pelcro-alert-content">
          {children}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          className="plc-flex-shrink-0 plc-w-6 plc-fill-current pelcro-modal-close pelcro-alert-close-btn"
          aria-label="close modal"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
