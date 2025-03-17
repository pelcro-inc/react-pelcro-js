import React, { useState } from "react";
import { PaymentMethodDeleteView } from "./PaymentMethodDeleteView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import { notify } from "../../SubComponents/Notification";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";

export const PaymentMethodDeleteModal = (props) => {
  const { t } = useTranslation("paymentMethod");
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;
  const { resetView } = usePelcro();
  const [open, setOpen] = useState(true);

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
      isOpen={open}
      onClose={() => setOpen(false)}
      id="pelcro-payment-method-delete-modal"
      className="plc-profile-menu-width"
      onDisplay={props.onDisplay}
    >
      <ModalHeader
        hideCloseButton={false}
        title={t("delete.title")}
        description={t("delete.subtitle")}
      />
      <ModalBody>
        <PaymentMethodDeleteView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

PaymentMethodDeleteModal.viewId = "payment-method-delete";
