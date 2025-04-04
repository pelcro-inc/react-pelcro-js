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
        <span className={`plc-flex plc-flex-wrap plc-justify-center plc-items-center plc-absolute plc-font-bold plc-rounded-full plc-text-xs plc-text-white plc-bg-primary-500 plc-min-w-[18px] plc-h-[18px] plc-px-1 plc-top-0 plc-right-0 plc-transform plc-translate-x-1/2 plc-translate-y-[-50%] ${badgeClassName}`}>
          {content}
        </span>
      )}
    </div>
  );
}
