import React from "react";
import { CardExpiryElement } from "react-stripe-elements";

export function PelcroCardExpiry({
  label = "",
  required,
  id,
  className = "",
  labelClassName = "",
  ...otherProps
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`text-gray-700 pelcro-input-label ${labelClassName}`}
      >
        {`${label}${required ? "*" : ""}`}
      </label>
      <CardExpiryElement
        id={id}
        className={`mt-1 w-full border border-gray-300 bg-gray-50 p-3 appearance-none outline-none rounded-sm focus:ring-1 focus:ring-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed pelcro-input-input ${className}`}
        {...otherProps}
      />
    </div>
  );
}
