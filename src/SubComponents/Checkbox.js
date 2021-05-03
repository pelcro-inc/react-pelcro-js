import React from "react";

export function Checkbox({
  className = "",
  labelClassName = "",
  id,
  children,
  ...otherProps
}) {
  return (
    <div className="plc-flex plc-items-center">
      <input
        type="checkbox"
        id={id}
        className={`pelcro-checkbox ${className}`}
        {...otherProps}
      />
      <label
        htmlFor={id}
        className={`pelcro-checkbox-label ${labelClassName}`}
      >
        {children}
      </label>
    </div>
  );
}
