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
  const site = window.Pelcro.site.read();

  return (
    <Modal id="pelcro-order-create-modal">
      <ModalHeader
        hideCloseButton={false}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
      />
      <ModalBody>
        <OrderCreateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
