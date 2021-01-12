import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../common/Header";
import Authorship from "../common/Authorship";
import { GiftRedeemView } from "./GiftRedeemView";

export const GiftRedeemModal = (props) => {
  const { t } = useTranslation("register");
  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-redeem"
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
              resetView={props.resetView}
              site={window.Pelcro.site.read()}
            ></Header>
            <div className="pelcro-prefix-modal-body">
              <GiftRedeemView {...props} />
            </div>
            <div className="pelcro-prefix-modal-footer">
              <small>
                {t("redeem.footer.click")}{" "}
                <button
                  className="pelcro-prefix-link"
                  onClick={() => props.setView("address")}
                >
                  {t("redeem.footer.here")}
                </button>{" "}
                {t("redeem.footer.toAdd")}
              </small>
              <Authorship></Authorship>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
