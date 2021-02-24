import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMarkOutlineIcon } from "../../assets/check-outline.svg";

export const PaymentSuccessView = ({ onClose, product }) => {
  const { t } = useTranslation("success");

  if (product) {
    return (
      <div className="flex flex-col items-center">
        <CheckMarkOutlineIcon className="w-32 my-4 text-green-500" />
        <div className="text-center text-gray-700">
          <h4 className="mb-4 text-3xl text-green-500">
            {product.paywall.success_title}
          </h4>
          <p>{product.paywall.success_content}</p>
        </div>
        <Button
          variant="outline"
          className="mt-6"
          onClick={onClose}
          autoFocus
        >
          {t("continue")}
        </Button>
      </div>
    );
  }
  return null;
};
