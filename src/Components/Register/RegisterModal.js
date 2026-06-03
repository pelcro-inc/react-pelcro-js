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
    isGift,
    set
  } = usePelcro();

  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

  // Auto-redeem gift if user is now authenticated and a pendingGiftCode
  // is in the store (e.g. they verified email or came back via deep link).
  // Same mechanism as pelcro-react-elements.
  const pendingGiftCode = window?.Pelcro?.store?.pendingGiftCode;
  if (pendingGiftCode && window.Pelcro.user.isAuthenticated()) {
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
          set({ giftRedemptionSuccess: true, giftCode: null, pendingGiftCode: null });
          return switchView("subscription-success");
        }
      }
    );
    return null; // Exit early to prevent rendering the registration form
  }

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

    if (!product && !order && !giftCode) {
      // If product and plan are not selected
      return resetView();
    }

    // If this is a redeem gift, proceed to address (where redeemGift API is called)
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
