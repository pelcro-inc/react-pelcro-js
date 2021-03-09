import React from "react";

export function Select({
  label = "",
  required,
  id,
  errorId,
  error = "",
  className = "",
  labelClassName = "",
  errorClassName = "",
  wrapperClassName = "",
  children,
  ...otherProps
}) {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      <label
        htmlFor={id}
        className={`text-gray-700 pelcro-select-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <select
        id={id}
        className={`mt-1 w-full border border-gray-300 bg-gray-50 p-3 text-sm appearance-none outline-none rounded-sm focus:ring-1 focus:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed pelcro-select-select ${className} ${
          error ? "ring-1 ring-red-500 pelcro-input-invalid" : ""
        }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      >
        {children}
      </select>
      <p
        id={errorId}
        aria-live="assertive"
        className="h-3 mt-1 mb-2 text-sm text-red-500 normal-case pelcro-field-error"
      >
        {error}
      </p>
    </div>
  );
}
