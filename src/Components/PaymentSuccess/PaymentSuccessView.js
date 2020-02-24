import React from "react";
import { useTranslation } from "react-i18next";
import Submit from "../common/Submit";

export const PaymentSuccessView = ({ resetView, product }) => {
  const { t } = useTranslation("success");

  if (product) {
    return (
      <React.Fragment>
        <div className="pelcro-prefix-title-block">
          <h4>{product.paywall.success_title}</h4>
        </div>
        <div>
          <p className="pelcro-prefix-center-text">
            {product.paywall.success_content}
          </p>
        </div>
        <Submit onClick={resetView} text={t("continue")}></Submit>
      </React.Fragment>
    );
  }
  return null;
};
