import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import { ReactComponent as TrashCanIcon } from "../../../assets/trash-can.svg";
import { Card } from "../Card";
import { AddNew } from "../AddNew";
import { Button } from "../../../SubComponents/Button";
import { getPaymentCardIcon } from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";
import { notify } from "../../../SubComponents/Notification";

// TODO: clean up the code
export const PaymentCardsMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const {
    switchView,
    setPaymentMethodToEdit,
    setPaymentMethodToDelete
  } = usePelcro();
  const [sources, setSources] = useState([]);
  // const source = window.Pelcro.user.read().source;

  useEffect(() => {
    window.Pelcro.paymentMethods.list(
      {
        auth_token: window.Pelcro.user.read().auth_token
      },
      (err, res) => {
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
    return switchView("payment-method-create");
  };

  const displaySourceEdit = (e) => {
    const source = e.currentTarget.dataset.key;

    setPaymentMethodToEdit(source);
    return switchView("payment-method-update");
  };

  const deletePaymentMethod = (
    paymentMethodId,
    onSuccess,
    onFailure
  ) => {
    // disable the Login button to prevent repeated clicks
    window.Pelcro.paymentMethods.deletePaymentMethod(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        payment_method_id: paymentMethodId
      },
      (err, res) => {
        if (err) {
          return onFailure?.(err);
        }
        onSuccess?.(res);
      }
    );
  };

  const onDeletePaymentMethodClick = (source) => {
    const isDeletable = source?.deletable;

    if (isDeletable) {
      notify.confirm(
        (onSuccess, onFailure) => {
          deletePaymentMethod(source.id, onSuccess, onFailure);
        },
        {
          confirmMessage: t(
            "messages.paymentMethodDeletion.isSureToDelete"
          ),
          loadingMessage: t("messages.paymentMethodDeletion.loading"),
          successMessage: t("messages.paymentMethodDeletion.success"),
          errorMessage: t("messages.paymentMethodDeletion.error")
        },
        {
          closeButtonLabel: t("labels.subCancellation.goBack")
        }
      );
    } else {
      setPaymentMethodToDelete(source.id);
      return switchView("payment-method-delete");
    }
  };

  return (
    <Card
      id="pelcro-dashboard-payment-menu"
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      title={t("labels.paymentSource")}
    >
      <PaymentCardsItems
        displaySourceEdit={displaySourceEdit}
        onDeletePaymentMethodClick={onDeletePaymentMethodClick}
        sources={sources}
      />
      <AddNew
        title={t("labels.addCard")}
        onClick={displaySourceCreate}
      />
    </Card>
  );
};

const PaymentCardsItems = (props) => {
  const { t } = useTranslation("dashboard");

  return props.sources.map((source, index) => (
    <div
      key={"dashboard-source-" + source.id}
      className={`plc-py-4 plc-px-6 plc-mt-5 plc-flex plc-items-center plc-justify-between last:plc-mb-0 plc-rounded plc-text-gray-900 pelcro-address-wrapper plc-bg-white plc-shadow-md_dark`}
    >
      <div className="plc-flex plc-items-center">
        <p className="plc-mr-6">
          {getPaymentCardIcon(source?.properties?.brand)}
        </p>
        <p className="plc-ml-1 plc-text-lg plc-tracking-widest">
          •••• •••• •••• {source?.properties?.last4}
        </p>
      </div>
      <div className="plc-flex-grow"></div>
      <Button
        id={"pelcro-button-update-source-" + index}
        variant="icon"
        className="plc-text-gray-500"
        data-key={source.id}
        icon={<EditIcon />}
        onClick={props?.displaySourceEdit}
      ></Button>
      <Button
        id={"pelcro-button-update-source-" + index}
        variant="icon"
        className="plc-text-gray-500"
        data-key={source.id}
        icon={<TrashCanIcon />}
        onClick={() => {
          props?.onDeletePaymentMethodClick(source);
        }}
      ></Button>
    </div>
  ));
};
