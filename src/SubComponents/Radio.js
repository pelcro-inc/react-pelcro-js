import React from "react";

export function Radio({
  wrapperClassName = "",
  className = "",
  labelClassName = "",
  id,
  children,
  ...otherProps
}) {
  return (
    <div className={`plc-flex plc-items-center ${wrapperClassName}`}>
      <input
        type="radio"
        id={id}
        className={`pelcro-radio ${className}`}
        {...otherProps}
      />
      <label
        htmlFor={id}
        className={`pelcro-radio-label ${labelClassName}`}
      >
        {children}
      </label>
    </div>
  );
}
