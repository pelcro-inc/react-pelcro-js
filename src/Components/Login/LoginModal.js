import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Link } from "../../SubComponents/Link";
import { usePelcro } from "../../hooks/usePelcro";
import {
  initPaywalls,
  initViewFromURL
} from "../PelcroModalController/PelcroModalController.service";
import { getStableViewID } from "../../utils/utils";
import { LoginView } from "./LoginView";

/**
 *
 */
export function LoginModal({ onDisplay, onClose, ...props }) {
  const { t } = useTranslation("login");
  const {
    switchView,
    resetView,
    product,
    plan,
    order,
    switchToAddressView,
    switchToPaymentView,
    giftCode,
    isGift
  } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    handleAfterLoginLogic();
  };

  const handleAfterLoginLogic = () => {
    if (window.Pelcro.paywall.isArticleRestricted()) {
      initPaywalls();
    }

    const viewFromURL = getStableViewID(
      window.Pelcro.helpers.getURLParameter("view")
    );

    if (pendingGiftCode) {
      // Clear all gift-related state and process redemption
      // Automatically redeem the gift without showing the modal again
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
              // If error, store the error info and go to success view to show the error there
              set({
                giftRedemptionError: {
                  code: pendingGiftCode,
                  error: err
                }
              });
              set({ giftCode: null, pendingGiftCode: null });
              return switchView("subscription-success");
            }
          } else {
            // Success - go directly to success view
            set({ giftRedemptionSuccess: true });
            return switchView("subscription-success");
          }
        }
      );
      return; // Exit early to prevent other logic
    }

    if (!product && !order && !giftCode) {
      // If product and plan are not selected
      return resetView();
    }

    // If this is a redeem gift
    if (giftCode) {
      return switchView("gift-redeem");
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

    const viewsURLs = [
      "invoice-details",
      "gift-redeem",
      "plan-select",
      "payment-method-update"
    ];

    if (viewsURLs.includes(viewFromURL)) {
      return initViewFromURL();
    }

    return resetView();
  };

  const onCreateAccountClick = () => {
    switchView("plan-select");
  };

  const onForgotPassword = () => {
    switchView("password-forgot");
  };

  const onPasswordlessRequest = () => {
    switchView("passwordless-request");
  };

  return (
    <Modal
      id="pelcro-login-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("messages.loginTo")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <LoginView
          onForgotPassword={onForgotPassword}
          {...props}
          onSuccess={onSuccess}
          onPasswordlessRequest={onPasswordlessRequest}
        />
      </ModalBody>
      <ModalFooter>
        <p className="plc-mb-4">
          <span className="plc-font-medium">
            {t("messages.dontHaveAccount") + " "}
          </span>
          <Link
            id="pelcro-link-create-account"
            onClick={onCreateAccountClick}
          >
            {t("messages.createAccount")}
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
}

LoginModal.viewId = "login";
