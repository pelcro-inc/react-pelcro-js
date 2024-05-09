import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodCreateView } from "../../../PaymentMethodCreate/PaymentMethodCreateView";
import { Card } from "../../Card";

export const PaymentMethodCreateMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-profile-menu"
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      // title={t("labels.profile")}
      title="Payment Method Create"
      back={{ target: "payment-cards" }}
    >
      <PaymentMethodCreateView onSuccess={() => {}} />
    </Card>
  );
};

PaymentMethodCreateMenu.viewId = "payment-method-create";
