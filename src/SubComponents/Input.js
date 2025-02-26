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
    <div className={`relative ${wrapperClassName}`}>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        className={`w-full rounded-lg  border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-800 focus:border focus:bg-white focus:shadow-sm focus:placeholder:text-gray-500 ${className} ${error ? "border-red-500" : ""
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
          className={`text-red-500 text-sm  mt-1 mx-1`}
        >
          {error}
        </div>
      )}
     
    </div>
  );
}
