import React from "react";
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

/**
 *
 */
export function SubscriptionCreateModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { t } = useTranslation("common");
  const { switchView } = usePelcro();

  const onSuccess = (res) => {
    otherProps.onSuccess?.(res);
    trackSubscriptionOnGA();

    return switchView("subscription-success");
  };

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
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

SubscriptionCreateModal.viewId = "subscription-create";
