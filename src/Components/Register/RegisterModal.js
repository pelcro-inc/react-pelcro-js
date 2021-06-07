import React from "react";
import ReactGA from "react-ga";
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
    cartItems,
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

    // If product and plan are not selected
    if (!product && !cartItems.length && !giftCode) {
      return resetView();
    }

    // If this is a redeem gift
    if (giftCode) {
      return switchToAddressView();
    }

    // Check if the subscription is meant as a gift (if so, gather recipients info)
    if (isGift) {
      return switchView("gift-create");
    }

    if (cartItems.length) {
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
        <div>
          {t("messages.alreadyHaveAccount") + " "}
          <Link onClick={() => switchView("login")}>
            {t("messages.loginHere")}
          </Link>
        </div>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

RegisterModal.viewId = "register";
