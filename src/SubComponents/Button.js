import React from "react";

const VARIANTS = {
  SOLID: "solid",
  OUTLINE: "outline",
  ICON: "icon",
  GHOST: "ghost"
};

const getClassName = (variant) => {
  switch (variant) {
    case VARIANTS.SOLID:
      return "w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-300";
    case VARIANTS.OUTLINE:
      return "w-full px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 disabled:border-primary-300 disabled:text-primary-300";
    case VARIANTS.ICON:
        return "p-2 text-primary-600 rounded-full hover:bg-primary-100";
    case VARIANTS.GHOST:
      return "w-full px-4 py-2 text-sm font-medium text-primary-700 rounded-lg hover:bg-primary-50 disabled:text-primary-400";
    default:
      return "w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-300";
  }
};

export function Button({
  variant = "solid",
  isLoading,
  icon,
  className = "",
  disabled,
  children,
  ...otherProps
}) {
  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed ${getClassName(
        variant
      )} ${className}`}
      disabled={disabled || isLoading}
      {...otherProps}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
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
                  ? "flex items-center justify-center w-full"
                  : "mr-2"
                } pointer-events-none`}
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
