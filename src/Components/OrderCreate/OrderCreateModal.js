import React from "react";
import Authorship from "../common/Authorship";
import { OrderCreateView } from "./OrderCreateView";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";

export const OrderCreateModal = ({ onClose, ...otherProps }) => {
  return (
    <Modal id="pelcro-order-create-modal">
      <ModalHeader hideCloseButton={false} onClose={onClose} />
      <ModalBody>
        <OrderCreateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
