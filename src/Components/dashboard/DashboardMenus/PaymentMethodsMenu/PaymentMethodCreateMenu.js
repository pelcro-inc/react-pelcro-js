import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodCreateView } from "../../../PaymentMethodCreate/PaymentMethodCreateView";
import { Card } from "../../Card";

export const PaymentMethodCreateMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-profile-menu"
      className="plc-profile-menu-width"
      // title={t("labels.profile")}
      title={t("labels.paymentMethodCreate")}
      back={{ target: "payment-cards" }}
    >
      <PaymentMethodCreateView onSuccess={() => { }} />
    </Card>
  );
};

PaymentMethodCreateMenu.viewId = "payment-method-create";
