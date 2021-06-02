import React from "react";
import Authorship from "../common/Authorship";
import { OrderCreateView } from "./OrderCreateView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const OrderCreateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchView } = usePelcro();

  const onSuccess = () => {
    otherProps.onSuccess?.();
    return switchView("order-confirm");
  };

  return (
    <Modal
      id="pelcro-order-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <OrderCreateView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

OrderCreateModal.viewId = "order-create";
