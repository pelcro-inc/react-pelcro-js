import React from "react";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { RegisterView } from "./RegisterView";

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
    order,
    giftCode,
    isGift
  } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    handleAfterRegistrationLogic();
  };

  const handleAfterRegistrationLogic = () => {
    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Registered",
      nonInteraction: true
    });

    const isEmailVerificationEnabled =
      window.Pelcro.site.read()?.email_verify_enabled ?? false;

    if (isEmailVerificationEnabled) {
      return switchView("email-verify");
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

    if (product) {
      if (product.address_required) {
        return switchToAddressView();
      } else {
        return switchToPaymentView();
      }
    }

    return resetView();
  };

  const title = product?.paywall?.register_title ?? t("title");
  const subtitle =
    product?.paywall?.register_subtitle ?? t("subtitle");

  return (
    <Modal
      id="pelcro-register-modal"
      onDisplay={props?.onDisplay}
      onClose={props?.onClose}
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper">
          <h4 className="plc-text-2xl plc-font-semibold">{title}</h4>
          <p>{subtitle}</p>
        </div>
      </ModalHeader>
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
