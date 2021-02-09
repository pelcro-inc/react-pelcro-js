import React from "react";

export function Input({
  label = "",
  required,
  id,
  errorId,
  error = "",
  className = "",
  labelClassName = "",
  errorClassName = "",
  ...otherProps
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`text-gray-700 text-xs pelcro-prefix-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <input
        type="text"
        id={id}
        className={`mt-1 w-full border border-gray-300 bg-gray-50 p-3 text-sm appearance-none outline-none rounded-sm focus:ring-1 focus:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed pelcro-prefix-input pelcro-prefix-form-control ${className} ${
          error ? "ring-1 ring-red-600 input-error" : ""
        }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      />
      <p
        id={errorId}
        className="h-4 my-2 text-red-600 normal-case pelcro-field-error"
      >
        {error}
      </p>
    </div>
  );
}
