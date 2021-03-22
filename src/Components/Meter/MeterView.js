import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../../SubComponents/Link";

export const MeterView = (props) => {
  const { t } = useTranslation("meter");
  const site = window.Pelcro.site.read();
  const plan =
    props.plan ?? window.Pelcro.paywall.getProduct()?.plans?.[0];
  const product = props.product ?? window.Pelcro.paywall.getProduct();
  const visitsLeft = window.Pelcro.paywall.freeVisitsLeft();

  const title =
    plan && `${product?.paywall?.meter_title}: ${visitsLeft}`;
  const subtitle = plan && product?.paywall?.meter_subtitle;

  const displayLoginView = () => {
    props.setView("login");
  };

  const displaySelectView = () => {
    props.setView("select");
  };

  return (
    <div className="plc-flex plc-items-center plc-justify-between">
      <div>
        <h4 className="plc-mb-2 plc-text-xl plc-font-semibold plc-text-gray-600">
          {title}
        </h4>
        <p className="plc-text-sm plc-text-gray-600">
          {subtitle}{" "}
          <Link className="plc-ml-1" onClick={displaySelectView}>
            {t("messages.subscribeNow")}
          </Link>
          {!window.Pelcro.user.isAuthenticated() && (
            <>
              <br />
              <span>
                {t("messages.alreadyHaveAccount") + " "}
                <Link className="plc-ml-1" onClick={displayLoginView}>
                  {t("messages.loginHere")}
                </Link>
              </span>
            </>
          )}
        </p>
      </div>
      {site.logo.url && (
        <img
          alt="avatar"
          className="plc-w-12 plc-h-12 plc-ml-4 plc-mr-2"
          src={site.logo.url}
        ></img>
      )}
    </div>
  );
};
