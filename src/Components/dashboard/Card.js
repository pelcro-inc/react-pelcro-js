import React from "react";
import { useTranslation } from "react-i18next";

export const Card = ({
  children,
  className = "",
  title,
  requestStates,
  ...restProps
}) => {
  const { t } = useTranslation("dashboard");
  return (
    <div
      className={`plc-bg-white plc-border-2 plc-p-6 md:plc-p-8 plc-rounded plc-my-11 md:plc-my-20 ${className}`}
      id="plc-dashboard-card"
    >
      {title && (
        <>
          <div className="plc-flex plc-items-end plc-justify-between">
            <h3 className="plc-font-bold plc-text-xl">{title}</h3>
            {requestStates?.loading && (
              <span className="plc-text-blue-500">Loading...</span>
            )}
            {requestStates?.success && (
              <span className="plc-text-green-500">Saved</span>
            )}
            {requestStates?.failed && (
              <span className="plc-text-red-500">Failed</span>
            )}
          </div>
          <hr className="plc-border-t-2 plc-my-4" />
        </>
      )}
      {children}
    </div>
  );
};
