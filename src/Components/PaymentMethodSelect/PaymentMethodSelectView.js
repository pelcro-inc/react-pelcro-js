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
          <div className="plc-flex plc-justify-center plc-mt-8">
            <PaymentMethodSelectSubmit
              role="submit"
              id="pelcro-submit"
              className="plc-w-full plc-rounded-lg plc-bg-primary-600 plc-text-white plc-font-medium plc-py-3 plc-transition-all hover:plc-bg-primary-700 hover:plc-shadow-md"
            />
          </div>

          <Link
           id="pelcro-add-payment-method" 
           onClick={props.onAddNewPaymentMethod}
            className="plc-mt-4 plc-w-full plc-flex plc-justify-center plc-items-center plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-transition-all hover:plc-bg-white hover:plc-border-gray-800 hover:plc-shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="plc-h-5 plc-w-5 plc-mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("select.buttons.addPaymentMethod")}
          </Link>


  


        </PaymentMethodSelectContainer>
      </form>
    </div>
  );
};
