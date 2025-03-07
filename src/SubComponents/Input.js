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
  placeholder = "",
  ...otherProps
}) {
  return (
    <div className={`plc-relative ${wrapperClassName}`}>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        className={`plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all placeholder:plc-text-gray-400 focus:plc-border-gray-800 focus:plc-border focus:plc-bg-white focus:plc-shadow-sm focus:placeholder:plc-text-gray-500 ${className} ${error ? "plc-border-red-500" : ""
          }`}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        {...otherProps}
      />
      {/* <label
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
      </label> */}
      {error && (
        <div
          id={errorId}
          aria-live="assertive"
          className={`plc-text-red-500 plc-text-xs plc-mt-1 plc-mx-1`}
        >
          {error}
        </div>
      )}

    </div>
  );
}
