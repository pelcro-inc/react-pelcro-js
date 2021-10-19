import React from "react";
import { usePelcro } from "../../../hooks/usePelcro";
import { notify } from "../../../SubComponents/Notification";
import { Trans } from "react-i18next";
import { Link } from "../../../SubComponents/Link";
import { getEntitlementsFromElem } from "../../../utils/utils";

export const init = () => {
  const { whenSiteReady, switchView, set } = usePelcro.getStore();

  whenSiteReady(() => {
    const entitlementsProtectedElements = document.querySelectorAll(
      "[data-pelcro-entitlements]"
    );

    if (entitlementsProtectedElements.length === 0) {
      return false;
    }

    if (
      !allElemsHaveSameEntitlements(entitlementsProtectedElements)
    ) {
      console.error(
        "not all elements protected by entitlements have the same entitlements, all elements protected by entitlements must have the exact same data-pelcro-entitlements attribute value"
      );
      return false;
    }

    entitlementsProtectedElements.forEach((elem) => {
      const entitlements = getEntitlementsFromElem(elem);

      if (entitlements.length === 0) {
        console.error(
          "invalid data-pelcro-entitlements attribute value",
          elem
        );
        return false;
      }

      if (
        window.Pelcro.product.getByEntitlements(entitlements)
          .length === 0
      ) {
        console.warn(
          "user can't subscribe to any plan that has any of the entitlement(s) needed, this is usually unintentional, make sure that the entitlements are spelled correctly, entitlements are case sensitive. make sure that your plans are configured in a way that allows users from all supported countries, using all supported currencies, to have access to your content by subscribing to certain plans that provide the needed entitlement(s)"
        );
      }

      if (shouldBlurContent(entitlements)) {
        // remove all event listeners from the elem by replacing it with a deep clone of itself
        const elemDeepClone = elem.cloneNode(true);
        elem.replaceWith(elemDeepClone);

        disableKeyboardInteractions(elemDeepClone);

        elemDeepClone.setAttribute(
          "style",
          "filter:blur(3px) !important; pointer-events:none !important; user-select:none !important"
        );

        unblurElemWhenUserSubscribes(elemDeepClone, entitlements);

        const NOTIFICATION_ID = "entitlement";
        notify(
          <p>
            <Trans i18nKey="messages:entitlement">
              Some of the content on this page is available with one
              or more of our plans.
              <Link
                onClick={() => {
                  const productId = Number(elem.dataset.productId);
                  const planId = Number(elem.dataset.planId);

                  const selectedProduct =
                    window.Pelcro.product.getById(productId);
                  const selectedPlan =
                    window.Pelcro.plan.getById(planId);
                  const hasValidProductAndPlan = Boolean(
                    selectedProduct && selectedPlan
                  );

                  if (hasValidProductAndPlan) {
                    set({
                      product: selectedProduct,
                      plan: selectedPlan
                    });
                  }
                  notify.dismiss(NOTIFICATION_ID);
                  switchView("_plan-select-entitlements");
                }}
              >
                Subscribe
              </Link>
              now to get full page access.
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
    return true;
  });
};

/**
 *
 */
function allElemsHaveSameEntitlements(elems) {
  const entitlements = getEntitlementsFromElem(elems[0]);

  return Array.from(elems).every((elem) => {
    const elemEntitlements = getEntitlementsFromElem(elem);
    if (elemEntitlements.length !== entitlements.length) return false;
    return entitlements.every((ent) =>
      elemEntitlements.includes(ent)
    );
  });
}

/**
 *
 */
function disableKeyboardInteractions(elem) {
  elem.addEventListener(
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
}

function unblurElemWhenUserSubscribes(elem, entitlements) {
  document.addEventListener("PelcroSubscriptionCreate", (event) => {
    const { isGift } = usePelcro.getStore();
    if (isGift) return;
    const latestSub =
      event.detail.data.subscriptions[
        event.detail.data.subscriptions.length - 1
      ];
    const shouldUnblurContent = entitlements.some(
      (ent) => latestSub?.plan?.entitlements?.includes(ent) ?? false
    );

    if (shouldUnblurContent) {
      elem.setAttribute(
        "style",
        "filter:inherit !important; pointer-events:inherit !important; user-select:inherit !important"
      );
    }
  });
}

function shouldBlurContent(entitlements) {
  return entitlements.every(
    (entitlement) => !window.Pelcro.user.isEntitledTo(entitlement)
  );
}
