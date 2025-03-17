import React from "react";

export const DashboardHeading = ({ title }) => {
  return (
    <>
      {title && (
        <header className="plc-pl-6 plc-my-4">
          <p className="plc-font-medium plc-tracking-wide plc-text-gray-500 plc-text-sm plc-uppercase">
            {title}
          </p>
        </header>
      )}
    </>
  );
};
