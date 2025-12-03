import React from "react";
import { PaymentMethodVerifyACHView } from "./PaymentMethodVerifyACHView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import { usePelcro, notify } from "../../components";
import { useTranslation } from "react-i18next";

export const PaymentMethodVerifyACHModal = (props) => {
  const { t } = useTranslation("paymentMethod");
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;
  const { resetView } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    if (enableReactGA4) {
      ReactGA4.event("Verify ACH payment method", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Verify ACH payment method",
        nonInteraction: true
      });
    }
    notify.success(t("verifyACH.verifiedSuccessfully"));
    resetView();
  };

  return (
    <Modal
      id="pelcro-payment-method-verify-ach-modal"
      onDisplay={props.onDisplay}
      onClose={props.onClose}
    >
      <ModalBody>
        <PaymentMethodVerifyACHView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PaymentMethodVerifyACHModal.viewId = "payment-method-verify-ach";
