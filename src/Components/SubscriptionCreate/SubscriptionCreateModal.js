import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { trackSubscriptionOnGA } from "../../utils/utils";
import Authorship from "../common/Authorship";
import { SubscriptionCreateView } from "./SubscriptionCreateView";
import {
  displayPaymentForm,
  submitPaymentForm
} from "../../utils/events";

/**
 *
 */
export function SubscriptionCreateModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { t } = useTranslation("common");
  const { switchView, product, plan } = usePelcro();

  const onSuccess = (res) => {
    otherProps.onSuccess?.(res);
    trackSubscriptionOnGA();

    document.dispatchEvent(
      submitPaymentForm({ submissionSuccess: true })
    );

    return switchView("subscription-success");
  };

  const onFailure = () => {
    return document.dispatchEvent(
      submitPaymentForm({ submissionSuccess: false })
    );
  };

  useEffect(() => {
    document.dispatchEvent(displayPaymentForm({ product, plan }));
  }, []);

  return (
    <Modal
      id="pelcro-subscription-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <SubscriptionCreateView
          {...otherProps}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

SubscriptionCreateModal.viewId = "subscription-create";
