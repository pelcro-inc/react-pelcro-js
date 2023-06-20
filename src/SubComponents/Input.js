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
      <input
        type="text"
        id={id}
        className={`pelcro-input-field ${className} ${
          error ? "pelcro-input-invalid" : ""
        }`}
        placeholder="placeholder"
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      />
      <label
        htmlFor={id}
        className={`pelcro-input-label ${labelClassName}`}
      >
        {`${label}`}
        {required ? (
          <span className="plc-text-gray-400 plc-inline-flex plc-ml-1">
            *
          </span>
        ) : (
          ""
        )}
      </label>
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
