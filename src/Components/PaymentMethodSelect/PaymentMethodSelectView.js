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
