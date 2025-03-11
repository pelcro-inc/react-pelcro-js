import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodUpdateView } from "../../../PaymentMethodUpdate/PaymentMethodUpdateView";
import { Card } from "../../Card";

export const PaymentMethodUpdateMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-profile-menu"
      className="plc-profile-menu-width"
      // title={t("labels.profile")}
      title="Payment Method Update"
      back={{ target: "payment-cards" }}
    >
      <PaymentMethodUpdateView onSuccess={() => { }} />
    </Card>
  );
};

PaymentMethodUpdateMenu.viewId = "payment-method-update";
