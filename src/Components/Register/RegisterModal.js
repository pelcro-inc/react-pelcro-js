import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { RegisterView } from "./RegisterView";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

/**
 *
 */
export function RegisterModal(props) {
  const { t } = useTranslation("register");

  const {
    switchView,
    resetView,
    switchToAddressView,
    switchToPaymentView,
    product,
    plan,
    order,
    giftCode,
    pendingGiftCode,
    isGift,
    set
  } = usePelcro();

  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    handleAfterRegistrationLogic();
  };

  const handleAfterRegistrationLogic = () => {
    if (enableReactGA4) {
      ReactGA4.event("Registered", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Registered",
        nonInteraction: true
      });
    }

    const isEmailVerificationEnabled =
      window.Pelcro.site.read()?.email_verify_enabled ?? false;

    if (isEmailVerificationEnabled) {
      return switchView("email-verify");
    }

    // If user came in via a gift link (?view=gift-redeem&gift_code=...),
    // auto-redeem the pending gift code immediately after registration.
    // The GiftRedeemContainer stores it as pendingGiftCode (and clears giftCode)
    // when an unauthenticated user submits the code.
    if (pendingGiftCode) {
      window.Pelcro.subscription.redeemGift(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          gift_code: pendingGiftCode
        },
        (err, res) => {
          if (err) {
            if (err.response?.data?.errors?.address_id) {
              switchToAddressView();
            } else {
              set({
                giftRedemptionError: {
                  code: pendingGiftCode,
                  error: err
                }
              });
            }
            set({ giftCode: null, pendingGiftCode: null });
            return switchView("subscription-success");
          } else {
            set({
              giftRedemptionSuccess: true,
              giftCode: null,
              pendingGiftCode: null
            });
            return switchView("subscription-success");
          }
        }
      );
      return;
    }

    if (!product && !order && !giftCode) {
      // If product and plan are not selected
      return resetView();
    }

    // Legacy gift flow: user entered code while already authenticated.
    // Proceed to address where the library calls redeemGift() automatically.
    if (giftCode) {
      return switchToAddressView();
    }

    // Check if the subscription is meant as a gift (if so, gather recipients info)
    if (isGift) {
      return switchView("gift-create");
    }

    if (order) {
      return switchToAddressView();
    }

    if (product && plan) {
      if (product.address_required) {
        return switchToAddressView();
      } else {
        return switchToPaymentView();
      }
    }

    if (product && !plan) {
      return switchView("plan-select");
    }

    return resetView();
  };

  return (
    <Modal
      id="pelcro-register-modal"
      onDisplay={props?.onDisplay}
      onClose={props?.onClose}
    >
      <ModalBody>
        <RegisterView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <p>
          {t("messages.alreadyHaveAccount") + " "}
          <Link onClick={() => switchView("login")}>
            {t("messages.loginHere")}
          </Link>
        </p>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

RegisterModal.viewId = "register";
