import React from "react";

export function Link({
  className = "",
  href = "#",
  children,
  ...otherProps
}) {
  return (
    <a
      className={`plc-underline plc-font-semibold plc-cursor-pointer hover:plc-text-primary-600 pelcro-link ${className}`}
      href={href}
      {...otherProps}
    >
      {children}
    </a>
  );
}
