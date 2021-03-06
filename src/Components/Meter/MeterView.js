import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";

export const MeterView = () => {
  const { t } = useTranslation("meter");
  const { switchView, product, isAuthenticated } = usePelcro();

  const paywallProduct =
    product ?? window.Pelcro.paywall.getProduct();

  const visitsLeft = window.Pelcro.paywall.freeVisitsLeft();
  const title = `${paywallProduct?.paywall?.meter_title}: ${visitsLeft}`;
  const subtitle = paywallProduct?.paywall?.meter_subtitle;

  return (
    <div>
      <h4 className="plc-mb-2 plc-text-2xl plc-font-semibold plc-text-gray-600">
        {title}
      </h4>
      <p className="plc-text-sm plc-text-gray-600">
        {subtitle}{" "}
        <Link
          className="plc-ml-1"
          onClick={() => switchView("plan-select")}
        >
          {t("messages.subscribeNow")}
        </Link>
        {!isAuthenticated() && (
          <>
            <br />
            <span>
              {t("messages.alreadyHaveAccount") + " "}
              <Link
                className="plc-ml-1"
                onClick={() => switchView("login")}
              >
                {t("messages.loginHere")}
              </Link>
            </span>
          </>
        )}
      </p>
    </div>
  );
};
