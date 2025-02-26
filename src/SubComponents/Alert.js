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
      className={`flex items-center justify-between p-2 mt-4 rounded-lg border ${type === "error"
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-green-50 border-green-200 text-green-800"
        } ${className}`}
      {...otherProps}
    >
      <div className="flex items-center gap-3">
        {type === "error" && (
          <ErrorIcon className="w-5 h-5 text-red-600" />
        )}
        {type === "success" && (
          <SuccessIcon className="w-5 h-5 text-green-600" />
        )}
        <div className="text-sm font-medium">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-opacity-20 hover:bg-gray-600 transition-colors"
          aria-label="close alert"
          onClick={onClose}
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
