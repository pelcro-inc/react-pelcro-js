import React from "react";
import { useTranslation } from "react-i18next";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

import { SubscriptionCreateView } from "./SubscriptionCreateView";

export function SubscriptionCreateModal({
  logout,
  plan,
  giftRecipient,
  product,
  resetView,
  onFailure = () => {},
  onSuccess = () => {},
  onDisplay = () => {}
}) {
  const { t } = useTranslation("payment");

  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-payment"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
          role="document"
        >
          <div className="pelcro-prefix-modal-content">
            <Header
              closeButton={window.Pelcro.paywall.displayCloseButton()}
              resetView={resetView}
              site={window.Pelcro.site.read()}
            ></Header>

            <div className="pelcro-prefix-modal-body">
              <SubscriptionCreateView
                plan={plan}
                giftRecipient={giftRecipient}
                product={product}
                onDisplay={onDisplay}
                onFailure={onFailure}
                onSuccess={onSuccess}
              />
            </div>
            <div className="pelcro-prefix-modal-footer">
              <small>
                {t("messages.haveQuestion")}{" "}
                {t("messages.visitOurFaq.visitOur")}{" "}
                <a
                  className="pelcro-prefix-link"
                  target="new"
                  href="https://www.pelcro.com/faq/user"
                >
                  {t("messages.visitOurFaq.faq")}
                </a>
                . {t("messages.cancel")}
                {" " + t("messages.logout.logout")}{" "}
                <button
                  className="pelcro-prefix-link"
                  onClick={logout}
                >
                  {t("messages.logout.here")}
                </button>
              </small>
              <Authorship></Authorship>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
