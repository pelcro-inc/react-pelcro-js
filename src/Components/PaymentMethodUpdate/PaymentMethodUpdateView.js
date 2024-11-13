import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodView } from "../PaymentMethod/PaymentMethodView";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { getPaymentCardIcon } from "../../utils/utils";

/**
 *
 */
export function PaymentMethodUpdateView(props) {
  const [t] = useTranslation("paymentMethod");

  const { paymentMethodToEdit, setPaymentMethodToEdit } = usePelcro();
  const [isLoading, setIsLoading] = useState(false);

  const [sources, setSources] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    window.Pelcro.paymentMethods.list(
      {
        auth_token: window.Pelcro.user.read().auth_token
      },
      (err, res) => {
        if (err) {
          setIsLoading(false);
          return console.error(err);
        }

        if (res) {
          setIsLoading(false);
          setSources(res.data);
        }
      }
    );
  }, []);

  const handleEditPaymentMethod = (source) => {
    setPaymentMethodToEdit(source.id);
  };

  const renderSources = () => {
    return (
      <div className="plc-flex plc-flex-col plc-items-center">
        {sources.map((source, index) => {
          return (
            <div
              key={source.id}
              className="plc-flex plc-flex-grow plc-items-center plc-justify-between plc-max-w-xs plc-p-4 plc-mb-2 plc-text-white plc-bg-gray-800 plc-rounded-md plc-h-14 plc-w-full plc-cursor-pointer"
              onClick={() => handleEditPaymentMethod(source)}
            >
              <span>
                {getPaymentCardIcon(source?.properties?.brand)}
              </span>
              <span className="plc-ml-1 plc-text-lg plc-tracking-widest plc-flex-grow plc-text-center">
                •••• {source?.properties?.last4}
              </span>
              <Button
                id={"pelcro-button-update-source-" + index}
                variant="icon"
                className="plc-text-white"
                icon={<EditIcon />}
                data-key={source.id}
                onClick={() => handleEditPaymentMethod(source)}
              ></Button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="plc-w-full plc-h-20 plc-bg-gray-300 plc-rounded-md plc-animate-pulse"></div>
      );
    }

    if (sources?.length > 0 && !paymentMethodToEdit) {
      return renderSources();
    }

    return (
      <PaymentMethodView
        type="updatePaymentSource"
        showCoupon={false}
        showExternalPaymentMethods={false}
        showApplePayButton={false}
        onDisplay={props.onDisplay}
        onFailure={props.onFailure}
        onSuccess={props.onSuccess}
      />
    );
  };

  const renderSubtitle = () => {
    if (sources?.length > 0 && !paymentMethodToEdit) {
      return t("update.selectSubtitle");
    }

    return t("update.subtitle");
  };

  return (
    <div id="pelcro-payment-method-update-view">
      <div className="plc-mb-2 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold ">
          {t("update.title")}
        </h4>
        {renderSubtitle()}
      </div>

      {renderContent()}
    </div>
  );
}
