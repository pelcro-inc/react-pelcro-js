import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
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
  ...otherProps
}) => {
  const { t } = useTranslation("register");
  const { switchView, switchToAddressView, isAuthenticated } =
    usePelcro();

  const onSuccess = (giftCode) => {
    otherProps.onSuccess?.(giftCode);
    if (isAuthenticated()) {
      switchToAddressView();
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
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("redeem.titles.firstTitle")}
          </h4>
          <p>{t("redeem.titles.secondTitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <GiftRedeemView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        {isAuthenticated() && (
          <p className="plc-mb-9">
            <span className="plc-font-medium">
              {t("redeem.footer.click") + " "}
            </span>
            <Link
              id="pelcro-link-redeem"
              onClick={switchToAddressView}
            >
              {t("redeem.footer.here") + " "}
            </Link>
            <span className="plc-font-medium">
              {t("redeem.footer.toAdd")}
            </span>
          </p>
        )}

        {/* {isAuthenticated() && (
          <p>
            {t("redeem.footer.click")}{" "}
            <Link
              id="pelcro-link-redeem"
              onClick={switchToAddressView}
            >
              {t("redeem.footer.here")}
            </Link>{" "}
            {t("redeem.footer.toAdd")}
          </p>
        )} */}
      </ModalFooter>
    </Modal>
  );
};

GiftRedeemModal.viewId = "gift-redeem";
