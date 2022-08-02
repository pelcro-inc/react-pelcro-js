import React from "react";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";
import { EmailVerifyView } from "./EmailVerifyView";
import {
  Modal,
  ModalHeader,
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

    if (product) {
      if (product.address_required) {
        return switchToAddressView();
      } else {
        return switchToPaymentView();
      }
    }
  };

  const { t } = useTranslation("verifyEmail");

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-email-verify-modal"
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("labels.title")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <EmailVerifyView onSuccess={onSuccess} {...otherProps} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

EmailVerifyModal.viewId = "email-verify";
