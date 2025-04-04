import React from "react";
import { ReactComponent as ErrorIcon } from "../assets/x-icon-solid.svg";
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
      className={`plc-flex plc-items-center plc-justify-between plc-p-2 plc-mt-4 plc-rounded-lg plc-border ${type === "error"
        ? "plc-bg-red-50 plc-border-red-200 plc-text-red-800"
        : "plc-bg-green-50 plc-border-green-200 plc-text-green-800"
        } ${className}`}
      {...otherProps}
    >
      <div className="plc-flex plc-items-center plc-gap-3">
        {type === "error" && (
          <ErrorIcon className="plc-w-5 plc-h-5 plc-text-red-600" />
        )}
        {type === "success" && (
          <SuccessIcon className="plc-w-5 plc-h-5 plc-text-green-600" />
        )}
        <div className="plc-text-sm plc-font-medium">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="plc-p-1.5 plc-rounded-lg plc-hover:bg-opacity-20 plc-hover:bg-gray-600 plc-transition-colors"
          aria-label="close alert"
          onClick={onClose}
        >
          <CloseIcon className="plc-w-4 plc-h-4" />
        </button>
      )}
    </div>
  );
}
