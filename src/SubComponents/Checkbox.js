import React from "react";

export function Checkbox({
  inputClassName = "",
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
        className={`plc-text-primary-500 checked:plc-border-transparent plc-rounded focus:plc-outline-none focus:plc-ring-2 focus:plc-ring-offset-2 focus:plc-ring-primary-300 text-md disabled:plc-cursor-not-allowed disabled:plc-text-gray-300 pelcro-checkbox-input ${inputClassName}`}
        {...otherProps}
      />
      <label
        htmlFor={id}
        className={`plc-ml-2 pelcro-checkbox-label ${labelClassName}`}
      >
        {children}
      </label>
    </div>
  );
}
