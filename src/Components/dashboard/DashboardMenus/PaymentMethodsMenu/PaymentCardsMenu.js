import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as EditIcon } from "../../../../assets/edit.svg";
import { ReactComponent as TrashCanIcon } from "../../../../assets/trash-can.svg";
import { Card } from "../../Card";
import { AddNew } from "../../AddNew";
import { Button } from "../../../../SubComponents/Button";
import { getPaymentCardIcon } from "../../../../utils/utils";
import { usePelcro } from "../../../../hooks/usePelcro";
import { Loader } from "../../../../SubComponents/Loader";

export const PaymentCardsMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const {
    switchView,
    switchDashboardView,
    setPaymentMethodToEdit,
    setPaymentMethodToDelete
  } = usePelcro();
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.Pelcro.paymentMethods.list(
      {
        auth_token: window.Pelcro.user.read().auth_token
      },
      (err, res) => {
        setIsLoading(false);
        if (err) {
          return console.error(err);
        }

        if (res) {
          setSources(res.data);
        }
      }
    );
  }, []);

  const displaySourceCreate = () => {
    return switchDashboardView("payment-method-create");
  };

  const displaySourceEdit = (e) => {
    const source = e.currentTarget.dataset.key;
    setPaymentMethodToEdit(source);
    return switchDashboardView("payment-method-update");
  };

  const onDeletePaymentMethodClick = (source) => {
    setPaymentMethodToDelete(source.id);
    return switchDashboardView("payment-method-delete");
  };

  return (
    <Card
      id="pelcro-dashboard-payment-menu"
      className="plc-profile-menu-width"
      title={t("labels.paymentSource")}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <PaymentCardsItems
          displaySourceEdit={displaySourceEdit}
          onDeletePaymentMethodClick={onDeletePaymentMethodClick}
          sources={sources}
        />
      )}
      <AddNew
        title={t("labels.addCard")}
        onClick={displaySourceCreate}
        className="plc-mt-6 plc-w-full sm:plc-w-full plc-max-w-full plc-min-w-full"
      />
    </Card>
  );
};

const PaymentCardsItems = ({ sources, displaySourceEdit, onDeletePaymentMethodClick }) => {
  const { t } = useTranslation("dashboard");

  if (sources.length > 0) {
    return sources
      .sort((a, b) =>
        a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1
      )
      .map((source, index) => (
        <div
          key={"dashboard-source-" + source.id}
          className={`plc-relative plc-py-4 plc-px-4 sm:plc-px-6 plc-mt-5 plc-min-h-16 plc-flex plc-items-center 
            plc-justify-between last:plc-mb-0 plc-rounded-lg plc-text-gray-900 plc-bg-white
            plc-border plc-border-gray-200 dark:plc-shadow-dark hover:plc-shadow-xl hover:plc-shadow-gray-300/50 plc-transition-all 
          plc-duration-300 ${source.is_default ? 'plc-border-2 plc-border-primary' : ''}`}
        >
          {source.is_default && (
            <span className="plc-absolute plc--top-3 plc-right-3 plc-rounded-full plc-bg-gray-800 plc-text-white plc-inline-flex plc-h-7 plc-my-auto plc-items-center plc-py-1 plc-px-4 plc-text-sm">
              {t("labels.default")}
            </span>
          )}
          <div className="plc-flex plc-items-center">
            <p className="plc-mr-4 sm:plc-mr-6">
              {getPaymentCardIcon(source?.properties?.brand)}
            </p>
            <p className="plc-ml-1 plc-text-base sm:plc-text-lg plc-tracking-widest">
              {source?.properties?.brand === "bacs_debit"
                ? "••••"
                : "•••• •••• ••••"}{" "}
              {source?.properties?.last4}
            </p>
          </div>
          <div className="plc-flex plc-items-center plc-justify-end">
            {source?.properties?.brand !== "bacs_debit" && (
              <Button
                id={"pelcro-button-update-source-" + index}
                variant="icon"
                size="small"
                className="plc-text-gray-500"
                data-key={source.id}
                icon={<EditIcon className="plc-w-4 plc-h-4" />}
                onClick={displaySourceEdit}
                aria-label="Edit Payment Method"
              />
            )}
            <Button
              id={"pelcro-button-delete-source-" + index}
              variant="icon"
              size="small"
              className="plc-text-red-500"
              data-key={source.id}
              icon={<TrashCanIcon className="plc-w-4 plc-h-4" />}
              onClick={() => onDeletePaymentMethodClick(source)}
              aria-label="Delete Payment Method"
            />
          </div>
        </div>
      ));
  } else {
    return (
      <div className="plc-text-center plc-text-lg plc-text-gray-500 plc-mt-4">
        {t("messages.noPaymentMethods")}
      </div>
    );
  }
};

PaymentCardsMenu.viewId = "payment-cards";
