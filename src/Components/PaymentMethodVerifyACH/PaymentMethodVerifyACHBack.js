import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { usePelcro } from "../../hooks/usePelcro";

export const PaymentMethodVerifyACHBack = () => {
  const { t } = useTranslation("paymentMethod");
  const { resetView } = usePelcro();

  return (
    <Button
      id="pelcro-button-verify-ach-back"
      variant="ghost"
      onClick={resetView}
    >
      {t("verifyACH.cancel")}
    </Button>
  );
};
