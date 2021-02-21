import React from "react";
import { useTranslation } from "react-i18next";
import { OrderCreateContainer } from "./OrderCreateContainer";
import { OrderCreateSubmitButton } from "./OrderCreateSubmitButton";
import { PelcroCardNumber } from "../../SubComponents/PelcroCardNumber";
import { PelcroCardCVC } from "../../SubComponents/PelcroCardCVC";
import { PelcroCardExpiry } from "../../SubComponents/PelcroCardExpiry";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { Alert } from "../../SubComponents/Alert";
import { Link } from "../../SubComponents/Link";

export const OrderCreateView = (props) => {
  const { t } = useTranslation("checkoutForm");
  const { t: tPayment } = useTranslation("payment");
  return (
    <div className="pelcro-order-create-view">
      <div className="flex flex-col items-center text-lg font-semibold pelcro-title-container">
        <h4>{tPayment("labels.checkout.title")}</h4>
      </div>
      <div className="mt-2 pelcro-form">
        <OrderCreateContainer {...props}>
          <AlertWithContext />
          <Alert hideIcon={true}>
            <span>
              {tPayment("messages.youAreSafe")}{" "}
              <Link
                rel="nofollow"
                target="new"
                href="https://www.stripe.com/us/customers"
              >
                Stripe
              </Link>{" "}
            </span>
          </Alert>
          <PelcroCardNumber
            id="pelcro-input-card-number"
            label={t("labels.card")}
          />
          <PelcroCardExpiry
            id="pelcro-input-card-expiry"
            label={t("labels.date")}
          />
          <PelcroCardCVC
            id="pelcro-input-cvc"
            label={t("labels.CVC")}
          />
          <OrderCreateSubmitButton
            className="mt-2"
            id="pelcro-submit"
            name={t("labels.submit")}
          />
        </OrderCreateContainer>
      </div>
    </div>
  );
};
