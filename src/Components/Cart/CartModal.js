import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { CartView } from "./CartView";

export const CartModal = ({ onDisplay, onClose, ...otherProps }) => {
  const { switchView, switchToAddressView, isAuthenticated } =
    usePelcro();

  const { t } = useTranslation("cart");

  const onSuccess = (items) => {
    otherProps.onSuccess?.(items);

    if (!isAuthenticated()) {
      return switchView("register");
    }

    switchToAddressView();
  };

  return (
    <Modal
      id="pelcro-cart-modal"
      onDisplay={onDisplay}
      onClose={onClose}
      hideCloseButton={false}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold ">{t("title")}</h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <CartView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

CartModal.viewId = "cart";
