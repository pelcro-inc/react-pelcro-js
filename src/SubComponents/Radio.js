import React from "react";

export function Radio({
  inputClassName = "",
  labelClassName = "",
  id,
  children,
  ...otherProps
}) {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        className={`text-primary-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 text-md disabled:cursor-not-allowed disabled:text-gray-300 pelcro-radio-input ${inputClassName}`}
        {...otherProps}
      />
      <label
        htmlFor={id}
        className={`ml-2 pelcro-radio-label ${labelClassName}`}
      >
        {children}
      </label>
    </div>
  );
}
