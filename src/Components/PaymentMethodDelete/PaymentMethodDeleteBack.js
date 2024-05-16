import React from "react";
import { Button } from "../../SubComponents/Button";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";

export const PaymentMethodDeleteBack = ({
  name,
  onClick,
  ...otherProps
}) => {
  const { t } = useTranslation("paymentMethod");
  const { switchDashboardView } = usePelcro();

  return (
    <Button
      variant="outline"
      onClick={() => {
        switchDashboardView("payment-cards");
        onClick?.();
      }}
      className="plc-w-full"
      {...otherProps}
    >
      {name ?? t("delete.buttons.back")}
    </Button>
  );
};
