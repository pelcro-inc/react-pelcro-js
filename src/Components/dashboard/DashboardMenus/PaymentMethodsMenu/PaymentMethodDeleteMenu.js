import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodDeleteView } from "../../../PaymentMethodDelete/PaymentMethodDeleteView";
import { Card } from "../../Card";
import { Alert } from "../../../../SubComponents/Alert";

export const PaymentMethodDeleteMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const [showAlert, setShowAlert] = useState();

  const onSuccess = () => {
    setShowAlert(true);
  };

  const onClose = () => {
    setShowAlert(false);
  };

  return (
    <Card
      id="pelcro-dashboard-profile-menu"
      className="plc-profile-menu-width"
      // title={t("labels.profile")}
      title="Payment Method Update"
      
    >
      {showAlert && (
        <Alert type="success" onClose={onClose} className="plc-mb-8">
          Payment Method Deleted Successfully
        </Alert>
      )}
      <PaymentMethodDeleteView onSuccess={onSuccess} />
    </Card>
  );
};

PaymentMethodDeleteMenu.viewId = "payment-method-delete";
