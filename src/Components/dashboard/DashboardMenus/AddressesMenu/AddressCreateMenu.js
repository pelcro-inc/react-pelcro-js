import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddressCreateView } from "../../../AddressCreate/AddressCreateView";
import { Card } from "../../Card";
import { Alert } from "../../../../SubComponents/Alert";

export const AddressCreateMenu = (props) => {
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
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      //   title={t("labels.profile")}
      title="Address Create"
      back={{ target: "addresses" }}
    >
      {showAlert && (
        <Alert type="success" onClose={onClose} className="plc-mb-8">
          Address Created Successfully
        </Alert>
      )}
      <AddressCreateView onSuccess={onSuccess} />
    </Card>
  );
};

AddressCreateMenu.viewId = "address-create";
