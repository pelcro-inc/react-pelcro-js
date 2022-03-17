import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionOptionsContainer } from "./SubscriptionOptionsContainer";
import { SubscriptionOptionsNewButton } from "./SubscriptionOptionsNewButton";
import { SubscriptionOptionsRenewButton } from "./SubscriptionOptionsRenewButton";
import { SubscriptionOptionsSubmit } from "./SubscriptionOptionsSubmit";

export const SubscriptionOptionsView = (props) => {
  const { t } = useTranslation("subscriptionOptions");

  return (
    <div id="pelcro-subscription-options-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("title")}
        </h4>
        <p>{t("subtitle")}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <SubscriptionOptionsContainer {...props}>
          <div className="plc-flex plc-justify-between plc-items-center">
            <SubscriptionOptionsRenewButton />
            <SubscriptionOptionsNewButton />
          </div>
          <SubscriptionOptionsSubmit
            role="submit"
            className="plc-mt-4 plc-w-full"
            name={t("next")}
            id="pelcro-submit"
          />
        </SubscriptionOptionsContainer>
      </form>
    </div>
  );
};
