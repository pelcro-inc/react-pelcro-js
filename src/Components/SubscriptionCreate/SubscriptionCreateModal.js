import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Link } from "../../SubComponents/Link";
import Authorship from "../common/Authorship";
import { SubscriptionCreateView } from "./SubscriptionCreateView";

export function SubscriptionCreateModal({
  logout,
  plan,
  giftRecipient,
  product,
  onClose,
  onFailure = () => {},
  onSuccess = () => {},
  onDisplay = () => {}
}) {
  const { t } = useTranslation("messages");
  const site = window.Pelcro.site.read();

  return (
    <Modal id="pelcro-subscription-create-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
      ></ModalHeader>

      <ModalBody>
        <SubscriptionCreateView
          plan={plan}
          giftRecipient={giftRecipient}
          product={product}
          onDisplay={onDisplay}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <small className="plc-mb-2 plc-text-center">
          {t("haveQuestion")} {t("visitOurFaq.visitOur")}{" "}
          <Link
            id="pelcro-link-faq"
            href="https://www.pelcro.com/faq/user"
            target="_blank"
          >
            {t("visitOurFaq.faq")}
          </Link>
          . {t("cancel")}
          {" " + t("logout.logout")}{" "}
          <Link id="pelcro-link-logout" onClick={logout}>
            {t("logout.here")}
          </Link>
        </small>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}
