import React from "react";

export function Input({
  label = "",
  required,
  id,
  hideErrors,
  errorId,
  error,
  className = "",
  labelClassName = "",
  errorClassName = "",
  wrapperClassName = "",
  ...otherProps
}) {
  return (
    <div className={`plc-w-full ${wrapperClassName}`}>
      <label
        htmlFor={id}
        className={`plc-text-gray-700 pelcro-input-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <input
        type="text"
        id={id}
        className={`${
          label && "plc-mt-1"
        } plc-w-full plc-border plc-border-gray-300 plc-bg-gray-50 plc-p-3 plc-appearance-none plc-outline-none plc-rounded-sm focus:plc-ring-1 focus:plc-ring-blue-400 disabled:plc-bg-gray-300 disabled:plc-cursor-not-allowed pelcro-input-input ${className} ${
          error
            ? "plc-ring-1 plc-ring-red-500 pelcro-input-invalid"
            : ""
        }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      />
      {!hideErrors && (
        <p
          id={errorId}
          aria-live="assertive"
          className={`plc-h-3 plc-mt-1 plc-mb-2 plc-text-sm plc-text-red-500 plc-normal-case pelcro-field-error ${errorClassName}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
