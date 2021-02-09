import React from "react";

export function Checkbox({
  className = "",
  id,
  children,
  ...otherProps
}) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        className={`text-primary-500 checked:border-transparent rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 text-md disabled:cursor-not-allowed disabled:text-gray-300 pelcro-checkbox-input ${className}`}
        {...otherProps}
      />
      <label htmlFor={id} className="ml-2 pelcro-checkbox-label">
        {children}
      </label>
    </div>
  );
}
