import React from "react";

export function DatePicker({
  label = "",
  required,
  id,
  errorId,
  error,
  className = "",
  labelClassName = "",
  errorClassName = "",
  ...otherProps
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`text-gray-700 pelcro-date-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <input
        type="date"
        id={id}
        className={`mt-1 w-full border border-gray-300 bg-gray-50 p-3 text-sm appearance-none outline-none rounded-sm focus:ring-1 focus:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed pelcro-date-input ${className} ${
          error ? "ring-1 ring-red-600 pelcro-input-invalid" : ""
        }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      />
      <p
        id={errorId}
        className={`h-4 my-2 text-red-600 normal-case pelcro-field-error ${errorClassName}`}
      >
        {error}
      </p>
    </div>
  );
}
