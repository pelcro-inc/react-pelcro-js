import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal"
import { Link } from "../../SubComponents/Link";
import { usePelcro } from "../../hooks/usePelcro";
import {
  initPaywalls,
  initViewFromURL
} from "../PelcroModalController/PelcroModalController.service";
import { getStableViewID } from "../../utils/utils";
import { LoginView } from "./LoginView";
import { notify } from "../../SubComponents/Notification";

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
    notify.success(t("messages.loginSuccess"));
    handleAfterLoginLogic();
  };

  const handleAfterLoginLogic = () => {
    if (window.Pelcro.paywall.isArticleRestricted()) {
      initPaywalls();
    }

    if (!product && !order && !giftCode) {
      // If product and plan are not selected
      return resetView();
    }

    // If this is a redeem gift
    if (giftCode) {
      return switchView("gift-redeem");
      // return switchToAddressView();
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

    const viewFromURL = getStableViewID(
      window.Pelcro.helpers.getURLParameter("view")
    );

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
    switchView("register");
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
      <ModalHeader hideCloseButton={false}
        title={t("messages.loginTo")}
        description={t("messages.loginToDescription")}
      >

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
        <p className="plc-text-center plc-text-sm plc-text-gray-500 plc-mt-8">
          {t("messages.dontHaveAccount") + " "}
          <Link
            id="pelcro-link-create-account"
            onClick={onCreateAccountClick}
            className="plc-font-medium plc-text-gray-900 plc-transition-colors hover:plc-underline"
          >
            {t("messages.createAccount")}
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
}

LoginModal.viewId = "login";
