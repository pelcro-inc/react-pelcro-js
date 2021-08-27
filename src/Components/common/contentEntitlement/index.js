import React from "react";
import { usePelcro } from "../../../hooks/usePelcro";
import { notify } from "../../../SubComponents/Notification";
import { Trans } from "react-i18next";
import { Link } from "../../../SubComponents/Link";

export const init = () => {
  const { whenSiteReady, view, resetView, switchView } =
    usePelcro.getStore();

  whenSiteReady(() => {
    const entitlementsProtectedElements = document.querySelectorAll(
      "[data-entitlement]"
    );

    entitlementsProtectedElements.forEach((elem) => {
      const shouldBlurContent = !window.Pelcro.user.isEntitledTo(
        elem.dataset.entitlement
      );

      if (shouldBlurContent) {
        // remove all event listeners from the elem by replacing it with a deep clone of itself
        const elemDeepClone = elem.cloneNode(true);
        elem.replaceWith(elemDeepClone);

        // disable keyboard interaction with blured content
        elemDeepClone.addEventListener(
          "keydown",
          (event) => {
            // allow tab key navigation to prevent focus trapping
            const TAB_KEY_CODE = 9;
            if (event.keyCode != TAB_KEY_CODE) {
              event.returnValue = false;
              return false;
            }
          },
          true
        );

        elemDeepClone.setAttribute(
          "style",
          "filter:blur(3px) !important; pointer-events:none !important; user-select:none !important"
        );

        /* 
        showing both the meter and the entitlements notification doesn't make sense from
        a product prespective + they would take half the screen on mobile devies, so we're
        hiding the meter, and showing the entitlements notification only.
        */
        if (view === "meter") {
          resetView();
        }

        const NOTIFICATION_ID = "entitlement";
        notify(
          <p>
            <Trans i18nKey="messages:entitlement">
              Some of the content on this page is available under one
              or more of our plans.
              <Link
                onClick={() => {
                  notify.dismiss(NOTIFICATION_ID);
                  switchView("plan-select");
                }}
              >
                Subscribe
              </Link>
              to one of our available plans get access to more content
            </Trans>
          </p>,
          {
            className: "pelcro-notification-entitlement",
            position: "bottom-right",
            duration: Infinity,
            id: NOTIFICATION_ID
          }
        );
      }
    });
  });
};
