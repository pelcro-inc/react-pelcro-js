import React from "react";

const VARIANTS = {
  SOLID: "solid",
  OUTLINE: "outline",
  ICON: "icon",
  GHOST: "ghost"
};

const SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large"
};

const getClassName = (variant, size) => {
  let baseClasses = "";

  // Size classes
  switch (size) {
    case SIZES.SMALL:
      baseClasses = "plc-text-xs plc-px-2 plc-py-1";
      break;
    case SIZES.LARGE:
      baseClasses = "plc-text-base plc-px-6 plc-py-3";
      break;
    case SIZES.MEDIUM:
    default:
      baseClasses = "plc-text-sm plc-px-4 plc-py-2";
      break;
  }

  // Variant classes
  switch (variant) {
    case VARIANTS.SOLID:
      return `plc-w-full ${baseClasses} plc-font-medium plc-text-white plc-bg-primary-600 plc-rounded-lg hover:plc-bg-primary-700 disabled:plc-bg-primary-300`;
    case VARIANTS.OUTLINE:
      return `plc-w-full ${baseClasses} plc-font-medium plc-text-primary-600 plc-border plc-border-primary-600 plc-rounded-lg hover:plc-bg-primary-50 disabled:plc-border-primary-300 disabled:plc-text-primary-200`;
    case VARIANTS.ICON:
      return `${size === SIZES.SMALL ? 'plc-p-1' : size === SIZES.LARGE ? 'plc-p-3' : 'plc-p-2'} plc-text-primary-600 plc-rounded-full hover:plc-bg-primary-100`;
    case VARIANTS.GHOST:
      return `plc-w-full ${baseClasses} plc-font-medium plc-rounded-lg hover:plc-text-amber-800 hover:plc-underline disabled:plc-text-primary-400`;
    default:
      return `plc-w-full ${baseClasses} plc-font-medium plc-text-white plc-bg-primary-600 plc-rounded-lg hover:plc-bg-primary-700 disabled:plc-bg-primary-300`;
  }
};

export function Button({
  variant = "solid",
  size = "medium",
  isLoading,
  icon,
  className = "",
  disabled,
  children,
  ...otherProps
}) {
  return (
    <button
      className={`plc-inline-flex plc-items-center plc-justify-center plc-transition-all plc-duration-200 disabled:plc-cursor-not-allowed ${getClassName(
        variant,
        size
      )} ${className}`}
      disabled={disabled || isLoading}
      {...otherProps}
    >
      {isLoading ? (
        <div className="plc-flex plc-items-center plc-justify-center plc-gap-2">
          <svg className="plc-w-4 plc-h-4 plc-animate-spin" viewBox="0 0 24 24">
            <circle
              className="plc-opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="plc-opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {variant !== VARIANTS.ICON && <span>Loading...</span>}
        </div>
      ) : (
        <>
          {icon && (
            <div
              className={`${variant === "icon"
                ? "plc-flex plc-items-center plc-justify-center plc-w-full"
                : "plc-mr-2"
                } plc-pointer-events-none`}
            >
              {icon}
            </div>
          )}
          {children}
        </>
      )}
    </button>
  );
}
