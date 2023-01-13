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
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">{title}</h4>
          <p>{subtitle}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <RegisterView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <p className="plc-mb-9">
          <span className="plc-font-medium">
            {t("messages.alreadyHaveAccount") + " "}
          </span>
          <Link onClick={() => switchView("login")}>
            {t("messages.loginHere")}
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
}

RegisterModal.viewId = "register";
