import React from "react";
import { useTranslation } from "react-i18next";
import { InvoiceDetailsContainer } from "./InvoiceDetailsContainer";
import { InvoiceDetailsPayButton } from "./InvoiceDetailsPayButton";

export const InvoiceDetailsView = (props) => {
  const { t } = useTranslation("address");

  return (
    <div id="pelcro-invoice-details-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("selectAddressTitle")}
        </h4>
        <p>{t("selectAddressSubtitle")}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <InvoiceDetailsContainer {...props}>
          <InvoiceDetailsPayButton
            role="submit"
            className="plc-mt-4 plc-w-full"
            name={t("buttons.selectAddress")}
            id="pelcro-submit"
          />
        </InvoiceDetailsContainer>
      </form>
    </div>
  );
};
