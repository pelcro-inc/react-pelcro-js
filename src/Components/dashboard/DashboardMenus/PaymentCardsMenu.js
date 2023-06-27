import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import { Card } from "../Card";
import { AddNew } from "../AddNew";
import { Button } from "../../../SubComponents/Button";
import { getPaymentCardIcon } from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";

export const PaymentCardsMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const { switchView } = usePelcro();
  const source = window.Pelcro.user.read().source;

  const displaySourceCreate = () => {
    return switchView("payment-method-update");
  };

  return (
    <Card
      id="pelcro-dashboard-payment-menu"
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      title={t("labels.paymentSource")}
    >
      {source ? (
        <PaymentCardsItems
          displaySourceCreate={displaySourceCreate}
          source={source}
        />
      ) : (
        <AddNew
          title={t("labels.addCard")}
          onClick={displaySourceCreate}
        />
      )}
    </Card>
  );
};

const PaymentCardsItems = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <div
      className={`plc-py-4 plc-px-6 plc-mt-5 plc-flex plc-items-center plc-justify-between last:plc-mb-0 plc-rounded plc-text-gray-900 pelcro-address-wrapper plc-bg-white plc-shadow-md_dark`}
    >
      <div className="plc-flex plc-items-center">
        <p className="plc-mr-6">
          {getPaymentCardIcon(props?.source?.properties?.brand)}
        </p>
        <p className="plc-ml-1 plc-text-lg plc-tracking-widest">
          •••• •••• •••• {props?.source?.properties?.last4}
        </p>
      </div>
      <Button
        variant="icon"
        className="plc-text-gray-500"
        icon={<EditIcon />}
        onClick={props?.displaySourceCreate}
      ></Button>
    </div>
  );
};
