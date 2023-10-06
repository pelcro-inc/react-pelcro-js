import React from "react";
import { PaymentMethodCreateView } from "./PaymentMethodCreateView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

export const PaymentMethodCreateModal = (props) => {
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
      id="pelcro-payment-method-create-modal"
      onDisplay={props.onDisplay}
      onClose={props.onClose}
    >
      <ModalBody>
        <PaymentMethodCreateView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PaymentMethodCreateModal.viewId = "payment-method-create";
