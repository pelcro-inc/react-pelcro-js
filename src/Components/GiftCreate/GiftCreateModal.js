import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
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
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("gift.titles.firstTitle")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <GiftCreateView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <p className="plc-mb-4">
          <span className="plc-font-medium">
            {t("messages.selectPlan") + " "}
          </span>
          <Link
            id="pelcro-link-select-plan"
            onClick={() => switchView("plan-select")}
          >
            {t("messages.here")}
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
};

GiftCreateModal.viewId = "gift-create";
