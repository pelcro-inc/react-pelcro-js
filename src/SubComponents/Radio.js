import React from "react";

export function Radio({
  inputClassName = "",
  labelClassName = "",
  id,
  children,
  ...otherProps
}) {
  return (
    <div className="plc-flex plc-items-center">
      <input
        type="radio"
        id={id}
        className={`plc-text-primary-500 checked:plc-border-transparent focus:plc-outline-none focus:plc-ring-2 focus:plc-ring-offset-2 focus:plc-ring-primary-300 plc-text-md disabled:plc-cursor-not-allowed disabled:plc-text-gray-300 pelcro-radio-input ${inputClassName}`}
        {...otherProps}
      />
      <label
        htmlFor={id}
        className={`plc-ml-2 pelcro-radio-label ${labelClassName}`}
      >
        {children}
      </label>
    </div>
  );
}
