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
import {
  displayAddressView,
  displayPaymentView
} from "../../utils/utils";

export const GiftCreateModal = ({
  onDisplay,
  onClose,
  hideHeaderLogo,
  ...otherProps
}) => {
  const { t } = useTranslation("register");
  const { switchView, product } = usePelcro();

  const onSuccess = (giftCode) => {
    otherProps.onSuccess?.(giftCode);
    if (product.address_required) {
      displayAddressView();
    } else {
      displayPaymentView();
    }
  };

  return (
    <Modal id="gift" onDisplay={onDisplay} onClose={onClose}>
      <ModalBody>
        <GiftCreateView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <p>
          {t("messages.selectPlan") + " "}
          <Link
            id="pelcro-link-select-plan"
            onClick={() => switchView("select")}
          >
            {t("messages.here")}
          </Link>
        </p>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

GiftCreateModal.viewId = "gift";
