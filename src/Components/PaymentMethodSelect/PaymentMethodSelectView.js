import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodSelectContainer } from "./PaymentMethodSelectContainer";
import { PaymentMethodSelectList } from "./PaymentMethodSelectList";
import { PaymentMethodSelectSubmit } from "./PaymentMethodSelectSubmit";
import { Link } from "../../SubComponents/Link";

export const PaymentMethodSelectView = (props) => {
  const { t } = useTranslation("paymentMethod");

  return (
    <div id="pelcro-payment-method-select-view">
      <div className="plc-mb-6 plc-space-y-2 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("select.title")}
        </h4>
        <p>{t("select.subtitle")}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <PaymentMethodSelectContainer {...props}>
          <PaymentMethodSelectList />
          <div className="plc-flex plc-justify-center plc-mt-4">
            <Link
              id="pelcro-add-payment-method"
              onClick={props.onAddNewPaymentMethod}
            >
              {t("select.buttons.addPaymentMethod")}
            </Link>
          </div>
          <PaymentMethodSelectSubmit
            role="submit"
            className="plc-w-full plc-mt-4"
            id="pelcro-submit"
          />
        </PaymentMethodSelectContainer>
      </form>
    </div>
  );
};
