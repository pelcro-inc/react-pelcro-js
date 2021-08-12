import i18n from "../../../i18n";
import { usePelcro } from "../../../hooks/usePelcro";
import { notify } from "../../../SubComponents/Notification";

export const init = () => {
  const { whenSiteReady } = usePelcro.getStore();

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

        const errorMsg = i18n.t("messages:entitlement");
        notify.warning(errorMsg, {
          position: "top-right",
          duration: Infinity,
          id: errorMsg
        });
      }
    });
  });
};
