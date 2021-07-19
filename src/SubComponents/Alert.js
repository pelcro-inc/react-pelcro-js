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
      className={`${
        type === "error"
          ? "pelcro-alert-error"
          : "pelcro-alert-success"
      } ${className}`}
      {...otherProps}
    >
      <div className="plc-inline-flex plc-items-center">
        {type === "error" && (
          <ErrorIcon className="pelcro-alert-icon" />
        )}
        {type === "success" && (
          <SuccessIcon className="pelcro-alert-icon" />
        )}
        <div className="pelcro-alert-content">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="pelcro-alert-close"
          aria-label="close alert"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
