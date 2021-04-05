import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { GiftRedeemView } from "./GiftRedeemView";
import { Link } from "../../SubComponents/Link";

export const GiftRedeemModal = ({
  onClose,
  setView,
  ...otherProps
}) => {
  const { t } = useTranslation("register");

  return (
    <Modal id="pelcro-gift-redeem-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
      />
      <ModalBody>
        <GiftRedeemView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <p>
          {t("redeem.footer.click")}{" "}
          <Link
            id="pelcro-link-redeem"
            onClick={() => setView("address")}
          >
            {t("redeem.footer.here")}
          </Link>{" "}
          {t("redeem.footer.toAdd")}
        </p>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
