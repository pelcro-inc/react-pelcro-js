import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMarkOutlineIcon } from "../../assets/check-outline.svg";

export const PaymentSuccessView = ({ onClose, product }) => {
  const { t } = useTranslation("success");

  if (product) {
    return (
      <div className="plc-flex plc-flex-col plc-items-center">
        <CheckMarkOutlineIcon className="plc-w-32 plc-my-4 plc-text-primary-500" />
        <div className="plc-text-center plc-text-gray-700">
          <h4 className="plc-mb-4 plc-text-3xl plc-text-primary-500">
            {product.paywall.success_title}
          </h4>
          <p>{product.paywall.success_content}</p>
        </div>
        <Button className="plc-mt-6" onClick={onClose} autoFocus>
          {t("continue")}
        </Button>
      </div>
    );
  }
  return null;
};
