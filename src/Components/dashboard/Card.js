import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as XIcon } from "../../assets/x-icon.svg";
import { Modal, ModalHeader, ModalBody } from "../ui/Modal";
import { store } from "./DashboardContainer";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../utils/action-types";

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
  const { dispatch } = useContext(store);

  const closeSubMenusTab = () => {
    switchDashboardView(null);
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: null
    });
  };
  return (
    <Modal
      id="plc-dashboard-card"
      className={className}
      back={back}
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
                <div className="plc-text-2xl plc-font-bold plc-text-gray-800 plc-flex plc-items-center">
                  {back?.target && (
                    <Link
                      onClick={() => {
                        switchDashboardView(back?.target);
                      }}
                      className="plc-flex plc-items-center plc-mr-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="plc-h-5 plc-w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
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
                  <div className="plc-flex plc-items-center plc-gap-2">
                    <span className="plc-animate-spin plc-inline-block plc-h-4 plc-w-4 plc-border-2 plc-border-primary-600 plc-border-t-transparent plc-rounded-full"></span>
                    <span className="plc-text-primary-600">{t("labels.loading", "Loading...")}</span>
                  </div>
                )}
                {requestStates?.success && (
                  <span className="plc-text-green-500">Saved</span>
                )}
                {requestStates?.failed && (
                  <span className="plc-text-red-500">Failed</span>
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
