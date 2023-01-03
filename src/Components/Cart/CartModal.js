import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
// import { CartView } from "./CartView";
const CartView = lazy(() =>
  import("./CartView").then((module) => {
    return { default: module.CartView };
  })
);

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
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold ">
            {t("title")}
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <CartView {...otherProps} onSuccess={onSuccess} />
        </Suspense>
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

CartModal.viewId = "cart";
