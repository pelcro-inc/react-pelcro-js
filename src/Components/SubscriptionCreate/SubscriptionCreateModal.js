import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { SubscriptionCreateView } from "./SubscriptionCreateView";

/**
 *
 */
export function SubscriptionCreateModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { t } = useTranslation("common");
  const { switchView, resetView, giftRecipient } = usePelcro();

  const onSuccess = () => {
    otherProps.onSuccess?.();
    if (giftRecipient) {
      window.alert(
        `${t("confirm.giftSent")} ${giftRecipient.email} ${t(
          "confirm.successfully"
        )}`
      );
      return resetView();
    }

    return switchView("success");
  };

  return (
    <Modal
      id="subscription-create"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <SubscriptionCreateView
          {...otherProps}
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

SubscriptionCreateModal.viewId = "subscription-create";
