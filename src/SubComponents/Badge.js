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
      className={`plc-relative plc-w-max pelcro-badge-wrapper ${className}`}
      {...otherProps}
    >
      {children}
      {content && (
        <span
          className={`plc-flex plc-flex-wrap plc-justify-center plc-items-center plc-absolute plc-font-bold plc-rounded-full plc-text-sm plc-text-white plc-bg-primary-500 plc-w-1/4 plc-h-1/4 pelcro-badge ${badgeClassName}`}
        >
          {content}
        </span>
      )}
    </div>
  );
}
