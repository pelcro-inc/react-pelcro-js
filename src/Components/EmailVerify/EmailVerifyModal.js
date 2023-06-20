import React from "react";
import { useTranslation } from "react-i18next";
import { EmailVerifyView } from "./EmailVerifyView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const EmailVerifyModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { product, plan, switchToAddressView, switchToPaymentView } =
    usePelcro();

  const onSuccess = (res) => {
    otherProps.onSuccess?.(res);

    if (product && plan) {
      if (product.address_required) {
        return switchToAddressView();
      } else {
        return switchToPaymentView();
      }
    }

    if (product && !plan) {
      return switchView("plan-select");
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
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
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
