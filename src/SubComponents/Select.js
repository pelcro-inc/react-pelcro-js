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
    <div className={`pelcro-input-wrapper ${wrapperClassName}`}>
      <label
        htmlFor={id}
        className={`pelcro-input-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <select
        id={id}
        className={`pelcro-input-field ${className} ${
          error ? "pelcro-input-invalid" : ""
        }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      >
        {children}
      </select>
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
