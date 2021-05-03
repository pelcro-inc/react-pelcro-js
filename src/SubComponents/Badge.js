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
      className={`pelcro-badge-wrapper ${className}`}
      {...otherProps}
    >
      {children}
      {content && (
        <span className={`pelcro-badge ${badgeClassName}`}>
          {content}
        </span>
      )}
    </div>
  );
}
