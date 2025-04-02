import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodCreateView } from "./PaymentMethodCreateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

export const PaymentMethodCreateModal = (props) => {
  const { t } = useTranslation("paymentMethod");
  const [open, setOpen] = React.useState(true);
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    if (enableReactGA4) {
      ReactGA4.event("Created payment card", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Created payment card",
        nonInteraction: true
      });
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      id="pelcro-payment-method-create-modal"
      onDisplay={props.onDisplay}
      className="plc-profile-menu-width"
    >
      <ModalHeader
        title={t("create.title")}
        description={t("create.subtitle")}
      />

      <ModalBody>
        <PaymentMethodCreateView {...props} onSuccess={onSuccess} />
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PaymentMethodCreateModal.viewId = "payment-method-create";
