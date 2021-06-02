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
import { usePelcro } from "../../hooks/usePelcro";

export const GiftRedeemModal = ({
  onClose,
  onDisplay,
  setView,
  hideHeaderLogo,
  ...otherProps
}) => {
  const { t } = useTranslation("register");
  const { switchView, displayAddressView } = usePelcro();

  const onSuccess = (giftCode) => {
    otherProps.onSuccess?.(giftCode);
    if (window.Pelcro.user.isAuthenticated()) {
      displayAddressView();
    } else {
      switchView("register");
    }
  };

  return (
    <Modal
      id="pelcro-gift-redeem-modal"
      onClose={onClose}
      onDisplay={onDisplay}
    >
      <ModalBody>
        <GiftRedeemView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <p>
          {t("redeem.footer.click")}{" "}
          <Link id="pelcro-link-redeem" onClick={displayAddressView}>
            {t("redeem.footer.here")}
          </Link>{" "}
          {t("redeem.footer.toAdd")}
        </p>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

GiftRedeemModal.viewId = "gift-redeem";
