import React from "react";
import Authorship from "../common/Authorship";
import { EmailVerifyView } from "./EmailVerifyView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

export const EmailVerifyModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { product, plan, switchToAddressView, switchToPaymentView } =
    usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);

    if (product && plan) {
      if (product.address_required) {
        return switchToAddressView();
      } else {
        return switchToPaymentView();
      }
    }
  };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-email-verify-modal"
    >
      <ModalBody>
        <EmailVerifyView onSuccess={onSuccess} {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

EmailVerifyModal.viewId = "email-verify";
