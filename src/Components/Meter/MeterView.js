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
    <div className="flex items-center justify-between">
      <div>
        <h4 className="mb-2 text-xl font-semibold text-gray-600">
          {title}
        </h4>
        <p className="text-sm text-gray-600">
          {subtitle}{" "}
          <Link className="ml-1" onClick={displaySelectView}>
            {t("messages.subscribeNow")}
          </Link>
          {!window.Pelcro.user.isAuthenticated() && (
            <>
              <br />
              <span>
                {t("messages.alreadyHaveAccount") + " "}
                <Link className="ml-1" onClick={displayLoginView}>
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
          className="w-12 h-12 ml-4 mr-2"
          src={site.logo.url}
        ></img>
      )}
    </div>
  );
};
