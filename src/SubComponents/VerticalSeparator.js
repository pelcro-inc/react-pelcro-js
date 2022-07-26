import React from "react";

export function VerticalSeparator({ className = "", ...otherProps }) {
  return (
    <span
      className={`pelcro-vertical-separator ${className}`}
      {...otherProps}
    ></span>
  );
}
