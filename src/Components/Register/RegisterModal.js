import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { displayAddressView } from "../../utils/utils";
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
    product,
    order,
    giftCode,
    isGift
  } = usePelcro();

  const onSuccess = () => {
    props.onSuccess?.();
    handleAfterRegistrationLogic();
  };

  const handleAfterRegistrationLogic = () => {
    // If product and plan are not selected
    if (!product && !order && !giftCode) {
      return resetView();
    }

    // If this is a redeem gift
    if (giftCode) {
      return displayAddressView();
    }

    // Check if the subscription is meant as a gift (if so, gather recipients info)
    if (isGift) {
      return switchView("gift");
    }

    if (order) {
      return displayAddressView();
    }

    if (product) {
      if (product.address_required) {
        return displayAddressView();
      } else {
        return switchView("payment");
      }
    }

    return resetView();
  };

  return (
    <Modal
      id="register"
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
        <div>
          {" " + t("messages.selectPlan")}
          <Link onClick={() => switchView("select")}>
            {t("messages.here")}
          </Link>
        </div>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

RegisterModal.id = "register";
