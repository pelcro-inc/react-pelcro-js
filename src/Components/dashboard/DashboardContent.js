import React, { useContext, useRef } from "react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as ExitIcon } from "../../assets/exit.svg";
import { ReactComponent as XIcon } from "../../assets/x-icon.svg";
import userSolidIcon from "../../assets/user-solid.svg";
import { usePelcro } from "../../hooks/usePelcro";
import { DashboardLink } from "./DashboardLink";
import { store } from "./DashboardContainer";
import {
  CLOSE_DASHBOARD,
  SET_ACTIVE_DASHBOARD_LINK
} from "../../utils/action-types";
import { SUB_MENUS } from "./utils";
import { DashboardViewController } from "./DashboardViewController";

export const DashboardContent = ({ children, subView, ...props }) => {
  const {
    state: { isOpen, activeDashboardLink },
    dispatch
  } = useContext(store);

  const { switchView, dashboardView, switchDashboardView, logout } =
    usePelcro();

  const { t } = useTranslation("dashboard");

  const { dashboardLayout } = props;

  const menuRef = useRef(null);
  const user = window.Pelcro.user.read();
  const userHasName = user.first_name || user.last_name;
  const profilePicture =
    window.Pelcro.user.read().profile_photo ?? userSolidIcon;

  // const newsletters = window.Pelcro?.uiSettings?.newsletters;
  // const siteHasNewslettersDefined =
  //   Array.isArray(newsletters) && newsletters.length > 0;

  // const initializeHideMenuHandler = () => {
  //   document.addEventListener("click", hideMenuIfClickedOutside);
  // };

  // const hideMenuIfClickedOutside = (event) => {
  //   const dashboardSubmenus = document.getElementById(
  //     "pelcro-view-dashboard-submenus"
  //   );

  //   const didClickOutsideMenu =
  //     isOpen &&
  //     menuRef.current &&
  //     !menuRef.current.contains(event.target) &&
  //     !dashboardSubmenus?.contains(event.target);

  //   if (didClickOutsideMenu) {
  //     dispatch({ type: CLOSE_DASHBOARD });
  //   }
  // };

  const setActiveDashboardLink = (submenuName) => {
    console.log(submenuName);
    if (submenuName == "logout") {
      logout();
    }
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  const displayProfilePicChange = () => {
    return switchView("profile-picture");
  };

  const closeDashboard = () => {
    dispatch({ type: CLOSE_DASHBOARD });
  };

  const closeSubMenusTab = () => {
    switchDashboardView(null);
  };

  // useEffect(() => {
  //   return () => {
  //     document.removeEventListener("click", hideMenuIfClickedOutside);
  //   };
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Transition
        className={`plc-fixed plc-inset-y-0 plc-h-full lg:plc-w-3/12 plc-w-full plc-overflow-y-auto plc-text-left plc-bg-white plc-shadow-xl plc-z-max ${
          dashboardLayout == "left" ? "plc-left-0" : "plc-right-0"
        }`}
        show={isOpen}
        enter="plc-transform plc-transition plc-duration-500"
        enterFrom={`${
          dashboardLayout == "left"
            ? "plc--translate-x-full"
            : "plc-translate-x-full"
        }`}
        enterTo="plc-translate-x-0"
        // afterEnter={initializeHideMenuHandler}
        leave="plc-transform plc-transition plc-duration-500"
        leaveFrom="plc-translate-x-0"
        leaveTo={`${
          dashboardLayout == "left"
            ? "plc--translate-x-full"
            : "plc-translate-x-full"
        }`}
        afterLeave={props?.onClose}
      >
        <div id="pelcro-view-dashboard" ref={menuRef}>
          <header className="plc-bg-gray-200 plc-flex plc-py-5">
            <div className="plc-flex plc-items-center">
              <div className="plc-flex plc-justify-center plc-ml-3 sm:plc-ml-6 plc-flex-shrink-0">
                <div className="plc-relative plc-flex-shrink-0">
                  <img
                    className="pelcro-user-profile-picture plc-bg-gray-300 plc-cursor-pointer plc-h-10 plc-rounded-md plc-w-10"
                    src={profilePicture}
                    alt="profile picture"
                    onClick={displayProfilePicChange}
                  />
                </div>
              </div>

              <div className="plc-flex plc-flex-col plc-justify-between plc-flex-grow plc-w-56 plc-ml-4 plc-break-words sm:plc-w-auto">
                {userHasName && (
                  <p className="plc-font-bold plc-break-all">
                    {user.first_name} {user.last_name}
                  </p>
                )}

                <p
                  className={`plc-m-0 plc-text-sm plc-break-all ${
                    userHasName
                      ? "plc-text-sm"
                      : "plc-text-lg plc-font-bold plc-mt-auto"
                  }`}
                >
                  {user.email}
                </p>
              </div>
              <div>
                <Button
                  variant="ghost"
                  type="button"
                  className="plc-text-gray-500 plc-rounded-2xl plc-absolute plc-z-max plc-top-5 plc-right-5"
                  onClick={closeDashboard}
                >
                  <XIcon className="plc-fill-current" />
                </Button>
              </div>
            </div>
          </header>
          <section className="plc-mt-6 plc-shadow-sm">
            {children?.length
              ? children.map((child, i) =>
                  React.cloneElement(child, { store, key: i })
                )
              : React.cloneElement(children, { store })}
          </section>
          <DashboardLink
            name={SUB_MENUS.LOGOUT}
            icon={<ExitIcon />}
            title={t("labels.logout")}
            setActiveDashboardLink={setActiveDashboardLink}
            activeDashboardLink={activeDashboardLink}
          />
        </div>
      </Transition>
      <div
        id="pelcro-view-dashboard-submenus"
        className={`plc-fixed plc-inset-y-0 plc-h-full lg:plc-w-9/12 plc-w-full plc-bg-gray-100 plc-z-max plc-overflow-auto ${
          dashboardLayout == "left" ? "plc-right-0" : "plc-left-0"
        }`}
      >
        {dashboardView && isOpen && (
          <DashboardViewController>
            {subView?.length
              ? subView.map((child, i) =>
                  React.cloneElement(child, { store, key: i })
                )
              : React.cloneElement(subView, { store })}
          </DashboardViewController>
        )}
      </div>
    </>
  );
};
