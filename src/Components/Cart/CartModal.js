import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
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
    >
      <ModalHeader
        hideCloseButton={false}
        title={t("title")}
        showTitleInLeft={true}
        // description={t("subtitle")}
      />

      <ModalBody>
        <CartView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
{/* 
      <ModalFooter>
      </ModalFooter> */}
    </Modal>
  );
};

CartModal.viewId = "cart";
