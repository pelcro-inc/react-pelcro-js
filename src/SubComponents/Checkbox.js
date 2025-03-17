import React from "react";

export function Checkbox({
  className = "",
  labelClassName = "",
  id,
  children,
  ...otherProps
}) {
  return (
    <div className="plc-flex plc-items-center plc-space-x-2">
      <input
        type="checkbox"
        id={id}
        className={`pelcro-checkbox ${className}
        plc-h-4 plc-w-4 plc-rounded-full plc-border plc-border-gray-300 plc-bg-gray-50/30 plc-text-primary-400 plc-transition-all plc-focus:ring-primary-400 plc-focus:ring-offset-white`}
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
