import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";
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
        {subtitle},
        {!isAuthenticated() &&
          " or " + t("messages.alreadyHaveAccount")}
      </p>
      <div className="plc-flex plc-mt-2">
        <Button className="plc-w-1/2" onClick={() => switchView("plan-select")}>
          {t("messages.subscribeNow")}
        </Button>
        {!isAuthenticated() && (
          <Button className="pelcro-button-ghost plc-w-1/2" onClick={() => switchView("login")}>
            {t("messages.loginHere")}
          </Button>
        )}
      </div>
    </div>
  );
};
