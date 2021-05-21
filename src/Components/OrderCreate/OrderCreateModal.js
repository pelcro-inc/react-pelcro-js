import React from "react";
import Authorship from "../common/Authorship";
import { OrderCreateView } from "./OrderCreateView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

export const OrderCreateModal = ({
  onClose,
  hideHeaderLogo,
  ...otherProps
}) => {
  return (
    <Modal
      hideCloseButton={false}
      onClose={onClose}
      id="pelcro-order-create-modal"
    >
      <ModalBody>
        <OrderCreateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
