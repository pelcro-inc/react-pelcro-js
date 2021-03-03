import React from "react";

export function Badge({
  className = "",
  badgeClassName = "",
  content,
  children,
  ...otherProps
}) {
  return (
    <div
      className={`relative w-max pelcro-badge-wrapper ${className}`}
      {...otherProps}
    >
      {children}
      {content && (
        <span
          className={`flex flex-wrap justify-center items-center absolute font-bold rounded-full text-sm text-white bg-primary-500 w-1/4 h-1/4 pelcro-badge ${badgeClassName}`}
        >
          {content}
        </span>
      )}
    </div>
  );
}
