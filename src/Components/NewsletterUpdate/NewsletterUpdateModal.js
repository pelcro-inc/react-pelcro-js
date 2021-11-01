import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { NewsletterUpdateView } from "./NewsletterUpdateView";

export const NewsletterUpdateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  return (
    <Modal
      id="pelcro-newsletter-update-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <NewsletterUpdateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

NewsletterUpdateModal.viewId = "newsletter-update";
