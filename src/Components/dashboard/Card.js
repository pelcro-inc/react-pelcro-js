import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as XIcon } from "../../assets/x-icon.svg";

export const Card = ({
  children,
  className = "",
  title,
  requestStates,
  dashboardLayout,
  back,
  ...restProps
}) => {
  const { t } = useTranslation("dashboard");
  const { switchDashboardView } = usePelcro();

  const closeSubMenusTab = () => {
    switchDashboardView(null);
  };
  return (
    <div
      className={`plc-relative plc-bg-white plc-border-2 plc-p-6 md:plc-p-8 plc-rounded plc-my-11 md:plc-mb-20 md:plc-mt-40 ${className}`}
      id="plc-dashboard-card"
    >
      {title && (
        <>
          <div className="plc-flex plc-items-end plc-justify-between plc-border-b-2 plc-border-primary-400 plc-pb-2 plc-mb-10 plc-mt-5">
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
            {back?.target && (
              <Link
                onClick={() => {
                  switchDashboardView(back?.target);
                }}
              >
                Back
              </Link>
            )}
          </div>
          {/* <hr className="plc-border-t-2 plc-my-4" /> */}
        </>
      )}
      {children}
      <Button
        variant="ghost"
        type="button"
        className="plc-text-gray-500 plc-rounded-2xl plc-absolute plc-z-max plc-top-1 plc-right-1"
        onClick={closeSubMenusTab}
      >
        <XIcon className="plc-fill-current" />
      </Button>
    </div>
  );
};
