import React from "react";

export function Input({
  label = "",
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
        className={`pelcro-input-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <input
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
