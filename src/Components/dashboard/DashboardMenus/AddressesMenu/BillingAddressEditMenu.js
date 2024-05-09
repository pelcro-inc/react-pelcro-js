import React from "react";
import { useTranslation } from "react-i18next";
import { AddressUpdateView } from "../../../AddressUpdate/AddressUpdateView";
import { Card } from "../../Card";

export const BillingAddressEditMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-profile-menu"
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      //   title={t("labels.profile")}
      title="Address Edit"
      back={{ target: "addresses" }}
    >
      <AddressUpdateView type="billing" />
    </Card>
  );
};

BillingAddressEditMenu.viewId = "billing-address-edit";
