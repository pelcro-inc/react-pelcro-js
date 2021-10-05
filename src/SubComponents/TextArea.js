import React from "react";
import { Tooltip } from "./Tooltip";

/**
 *
 */
export function TextArea({
  label = "",
  tooltipText,
  required,
  id,
  errorId,
  error,
  className = "",
  labelClassName = "",
  errorClassName = "",
  wrapperClassName = "",
  ...otherProps
}) {
  return (
    <div className={`pelcro-input-wrapper ${wrapperClassName}`}>
      <label
        htmlFor={id}
        className={`pelcro-input-label plc-flex plc-items-center ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}

        {tooltipText && (
          <Tooltip value={tooltipText} className="plc-ml-1" />
        )}
      </label>
      <textarea
        type="text"
        id={id}
        className={`pelcro-input-field ${className} ${
          error ? "pelcro-input-invalid" : ""
        }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      />
      {error && (
        <p
          id={errorId}
          aria-live="assertive"
          className={`pelcro-input-error ${errorClassName}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
