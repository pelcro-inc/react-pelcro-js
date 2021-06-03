import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMark } from "../../assets/check-solid.svg";
import { usePelcro } from "../../hooks/usePelcro";

export const PaymentSuccessView = ({ onClose }) => {
  const { t } = useTranslation("success");
  const { product } = usePelcro();

  if (product) {
    return (
      <div className="plc-flex plc-flex-col plc-items-center">
        <CheckMark className="plc-w-32 plc-my-4 plc-text-green-500" />
        <div className="plc-text-center plc-text-gray-900">
          <h4 className="plc-mb-4 plc-text-3xl">
            {product.paywall.success_title}
          </h4>
          <p>{product.paywall.success_content}</p>
        </div>
        <Button
          className="plc-mt-6"
          onClick={onClose}
          autoFocus={true}
        >
          {t("continue")}
        </Button>
      </div>
    );
  }
  return null;
};
