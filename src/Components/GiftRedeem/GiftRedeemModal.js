import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { GiftRedeemView } from "./GiftRedeemView";
import { Link } from "../../SubComponents/Link";
import { userHasAddress } from "../../utils/utils";

export const GiftRedeemModal = ({
  onClose,
  setView,
  hideHeaderLogo,
  ...otherProps
}) => {
  const { t } = useTranslation("register");

  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      hideHeaderLogo={hideHeaderLogo}
      id="pelcro-gift-redeem-modal"
    >
      <ModalBody>
        <GiftRedeemView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <p>
          {t("redeem.footer.click")}{" "}
          <Link
            id="pelcro-link-redeem"
            onClick={() => {
              if (userHasAddress()) {
                return setView("address-select");
              }
              return setView("address");
            }}
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
