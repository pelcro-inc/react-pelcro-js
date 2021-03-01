import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { GiftCreateView } from "./GiftCreateView";
import { Link } from "../../SubComponents/Link";

export const GiftCreateModal = ({
  setView,
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const site = window.Pelcro.site.read();
  const { t } = useTranslation("register");

  useEffect(() => {
    if (onDisplay) {
      onDisplay();
    }
  }, []);

  return (
    <Modal id="pelcro-gift-create-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
      />
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
