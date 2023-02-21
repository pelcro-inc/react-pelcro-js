import React from "react";

export const DashboardHeading = ({ title }) => {
  return (
    <>
      {title && (
        <header className="plc-pl-4 plc-my-2 sm:plc-pl-8">
          <p className="plc-font-bold plc-tracking-widest plc-text-gray-500">
            {title}
          </p>
        </header>
      )}
    </>
  );
};
