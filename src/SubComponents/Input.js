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
  ...otherProps
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`text-gray-700 pelcro-input-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <input
        type="text"
        id={id}
        className={`${
          label && "mt-1"
        } w-full border border-gray-300 bg-gray-50 p-3 appearance-none outline-none rounded-sm focus:ring-1 focus:ring-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed pelcro-input-input ${className} ${
          error ? "ring-1 ring-red-500 pelcro-input-invalid" : ""
        }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      />
      {!hideErrors && (
        <p
          id={errorId}
          aria-live="assertive"
          className={`h-3 mt-1 mb-2 text-sm text-red-500 normal-case pelcro-field-error ${errorClassName}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
