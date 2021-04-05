import React from "react";

export function Link({
  className = "",
  href = "#",
  isButton = true,
  children,
  ...otherProps
}) {
  const handleSpaceBar = (event) => {
    if (event.keyCode === 32) event.target.click();
  };

  return (
    <a
      className={`plc-underline plc-font-semibold plc-cursor-pointer hover:plc-text-primary-600 pelcro-link ${className}`}
      href={href}
      {...(isButton && { role: "button", onKeyDown: handleSpaceBar })}
      {...otherProps}
    >
      {children}
    </a>
  );
}
