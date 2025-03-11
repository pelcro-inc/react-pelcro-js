import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as XIcon } from "../../assets/x-icon.svg";
import { Modal, ModalHeader, ModalBody } from "../ui/Modal";


export const Card = ({
  children,
  className = "",
  title,
  description,
  requestStates,
  dashboardLayout,
  back,
  style,
  ...restProps
}) => {
  const { t } = useTranslation("dashboard");
  const { switchDashboardView } = usePelcro();

  const closeSubMenusTab = () => {
    switchDashboardView(null);
  };
  return (
    <Modal
      id="plc-dashboard-card"
      className={className}
      {...restProps}
    >
      <ModalHeader
        fromDashboard={true}  
        onCloseModal={closeSubMenusTab}
      >
        {title && (
          <>
            <div className="plc-flex plc-items-end plc-justify-between plc-mb-4">
              <div>
                <div className="plc-text-2xl plc-font-bold plc-text-gray-800" >
                  {title}
                </div>
                {
                  description ? (
                    <div className="plc-mt-2 plc-text-gray-500">
                      {description}
                    </div>
                  ) : null
                }
              </div>

              <div className="">
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
            </div>
          </>
        )}
      </ModalHeader>
      <ModalBody

      >
        {children}
      </ModalBody>
    </Modal >
  );
};
