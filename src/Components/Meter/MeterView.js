import React from "react";
import { useTranslation } from "react-i18next";

export const MeterView = (props) => {
  const { t } = useTranslation("meter");

  const plan =
    props.plan ||
    (window.Pelcro.paywall.getProduct() &&
      window.Pelcro.paywall.getProduct().plans[0]);
  const product = props.product || window.Pelcro.paywall.getProduct();
  const visitsLeft = window.Pelcro.paywall.freeVisitsLeft();
  const site = window.Pelcro.site.read();

  const displayLoginView = () => {
    props.setView("login");
  };

  const displaySelectView = () => {
    props.setView("select");
  };

  return (
    <React.Fragment>
      {site.logo.url && (
        <img
          alt="avatar"
          className="pelcro-prefix-site-logo pelcro-prefix-center"
          src={site.logo.url}
        ></img>
      )}
      <div>
        <h4>
          {plan && product.paywall.meter_title}: {visitsLeft}
        </h4>
        <p>
          {plan && product.paywall.meter_subtitle}{" "}
          <button className="pelcro-prefix-link" onClick={displaySelectView}>
            {t("messages.subscribeNow")}
          </button>
          {!window.Pelcro.user.isAuthenticated() && (
            <span>
              {" " + t("messages.alreadyHaveAccount") + " "}
              <button className="pelcro-prefix-link" onClick={displayLoginView}>
                {" "}
                {t("messages.loginHere")}
              </button>
            </span>
          )}
        </p>
      </div>
    </React.Fragment>
  );
};
