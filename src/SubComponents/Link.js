import React from "react";

export function Link({
  className = "",
  href = "#",
  children,
  ...otherProps
}) {
  return (
    <a
      className={`underline font-semibold cursor-pointer hover:text-primary-600 pelcro-prefix-link pelcro-link ${className}`}
      href={href}
      {...otherProps}
    >
      {children}
    </a>
  );
}
