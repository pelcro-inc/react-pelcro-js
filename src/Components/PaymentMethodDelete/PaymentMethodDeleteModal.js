import React from "react";
import { PaymentMethodDeleteView } from "./PaymentMethodDeleteView";
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

export const PaymentMethodDeleteModal = (props) => {
  const { t } = useTranslation("paymentMethod");
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;
  const { resetView } = usePelcro();
  const onSuccess = (res) => {
    props.onSuccess?.(res);
    if (enableReactGA4) {
      ReactGA4.event("Delete payment card", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Delete payment card",
        nonInteraction: true
      });
    }
    notify.success(t("delete.deletedSuccessfully"));
    resetView();
  };

  return (
    <Modal
      id="pelcro-payment-method-delete-modal"
      onDisplay={props.onDisplay}
      onClose={props.onClose}
    >
      <ModalBody>
        <PaymentMethodDeleteView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PaymentMethodDeleteModal.viewId = "payment-method-delete";
