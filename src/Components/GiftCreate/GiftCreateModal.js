import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { GiftCreateView } from "./GiftCreateView";
import { Link } from "../../SubComponents/Link";

export const GiftCreateModal = ({
  setView,
  onDisplay,
  onClose,
  hideHeaderLogo,
  ...otherProps
}) => {
  const { t } = useTranslation("register");

  useEffect(() => {
    if (onDisplay) {
      onDisplay();
    }
  }, []);

  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      hideHeaderLogo={hideHeaderLogo}
      id="pelcro-gift-create-modal"
    >
      <ModalBody>
        <GiftCreateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <p>
          {t("messages.selectPlan") + " "}
          <Link
            id="pelcro-link-select-plan"
            onClick={() => setView("select")}
          >
            {t("messages.here")}
          </Link>
        </p>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
