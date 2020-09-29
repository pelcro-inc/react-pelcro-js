import React from "react";
import { useTranslation } from "react-i18next";
import { AlertDanger } from "../Alerts/AlertDanger";

import Header from "../common/Header";
import Authorship from "../common/Authorship";
import { GiftCreateView } from "./GiftCreateView";

export const GiftCreateModal = (props) => {
  const { t } = useTranslation("register");
  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-gift"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered">
          <div
            className="pelcro-prefix-modal-content"
            role="document"
          >
            <Header
              closeButton={window.Pelcro.paywall.displayCloseButton()}
              resetView={() => props.setView("")}
              site={window.Pelcro.site.read()}
            ></Header>
            <div className="pelcro-prefix-modal-body">
              <div className="pelcro-prefix-title-block">
                <h4>{t("gift.titles.firstTitle")}</h4>
                <p>{t("gift.titles.secondTitle")}</p>
              </div>

              <AlertDanger name="gift" />

              <div className="pelcro-prefix-form">
                <GiftCreateView {...props} />
              </div>
            </div>
            <div className="pelcro-prefix-modal-footer">
              <small>
                {" " + t("messages.selectPlan")}
                <button
                  className="pelcro-prefix-link"
                  onClick={() => props.setView("select")}
                >
                  {t("messages.here")}
                </button>
              </small>
              <Authorship></Authorship>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
