import React, { lazy, Suspense } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
// import { PaymentSuccessView } from "./PaymentSuccessView";
const PaymentSuccessView = lazy(() =>
  import("./PaymentSuccessView").then((module) => {
    return { default: module.PaymentSuccessView };
  })
);

/**
 *
 */
export function PaymentSuccessModal({ onDisplay, ...props }) {
  const { resetView } = usePelcro();

  const onClose = () => {
    props.onClose?.();
    return resetView();
  };

  return (
    <Modal
      id="pelcro-subscription-success-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <PaymentSuccessView onClose={onClose} />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

PaymentSuccessModal.viewId = "subscription-success";
