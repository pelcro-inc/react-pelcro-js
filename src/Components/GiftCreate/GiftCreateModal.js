import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { GiftCreateView } from "./GiftCreateView";
import { Link } from "../../SubComponents/Link";
import { usePelcro } from "../../hooks/usePelcro";

export const GiftCreateModal = ({
  onDisplay,
  onClose,
  hideHeaderLogo,
  ...otherProps
}) => {
  const { t } = useTranslation("register");
  const {
    switchView,
    switchToAddressView,
    switchToPaymentView,
    product
  } = usePelcro();

  const onSuccess = (giftRecipient) => {
    otherProps.onSuccess?.(giftRecipient);
    if (product.address_required) {
      switchToAddressView();
    } else {
      switchToPaymentView();
    }
  };

  return (
    <Modal
      id="pelcro-gift-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <GiftCreateView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <p>
          {t("messages.selectPlan") + " "}
          <Link
            id="pelcro-link-select-plan"
            onClick={() => switchView("plan-select")}
          >
            {t("messages.here")}
          </Link>
        </p>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

GiftCreateModal.viewId = "gift-create";
