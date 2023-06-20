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
    switchToPaymentView
  } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);

    if (window.Pelcro.paywall.isArticleRestricted()) {
      initPaywalls();
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

    if (order) {
      return switchToAddressView();
    }

    resetView();

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
      initViewFromURL();
    }
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
