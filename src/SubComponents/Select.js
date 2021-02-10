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
  children,
  ...otherProps
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`text-gray-700 text-xs pelcro-prefix-label pelcro-select-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <select
        id={id}
        className={`mt-1 w-full border border-gray-300 bg-gray-50 p-3 text-sm appearance-none outline-none rounded-sm focus:ring-1 focus:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed pelcro-select-select ${className} ${
          error ? "ring-1 ring-red-600 input-error" : ""
        }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      >
        {children}
      </select>
      <p
        id={errorId}
        className="h-4 my-2 text-red-600 normal-case pelcro-field-error"
      >
        {error}
      </p>
    </div>
  );
}
