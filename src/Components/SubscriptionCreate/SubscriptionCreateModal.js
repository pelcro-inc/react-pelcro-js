import React from "react";
import { useTranslation } from "react-i18next";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

import { SubscriptionCreateView } from "./SubscriptionCreateView";

export function SubscriptionCreateModal({
  resetView,
  logout,
  plan,
  subscriptionIdToRenew,
  giftRecipient,
  product,
  setView,
  isGift,
}) {
  const { t } = useTranslation("messages");
  // showCouponField = () => {
  //   this.setState({
  //     enableCouponField: !this.state.enableCouponField
  //   });
  // };

  // onCouponCodeChange(event) {
  //   this.setState({ couponCode: event.target.value });
  // }

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
                subscriptionIdToRenew={subscriptionIdToRenew}
                giftRecipient={giftRecipient}
                product={product}
                setView={setView}
                resetView={resetView}
                isGift={isGift}
              />
            </div>
            <div className="pelcro-prefix-modal-footer">
              <small>
                {t("haveQuestion")} {t("visitOurFaq.visitOur")}{" "}
                <a
                  className="pelcro-prefix-link"
                  target="new"
                  href="https://www.pelcro.com/faq/user"
                >
                  {t("visitOurFaq.faq")}
                </a>
                . {t("cancel")}
                {" " + t("logout.logout")}{" "}
                <button className="pelcro-prefix-link" onClick={logout}>
                  {t("logout.here")}
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
