import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import {
  calcAndFormatItemsTotal,
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import { InvoiceDetailsContainer } from "./InvoiceDetailsContainer";
import { InvoiceDetailsDownloadButton } from "./InvoiceDetailsDownloadButton";
import { InvoiceDetailsPayButton } from "./InvoiceDetailsPayButton";

export const InvoiceDetailsView = (props) => {
  const { t } = useTranslation("invoiceDetails");

  const { invoice } = usePelcro();
  const showPayButton = canPayInvoice(invoice);
  const showDownloadButton = Boolean(invoice?.invoice_pdf);
  const hasPlanDetails = Boolean(invoice.plan);
  const creationDate = new Date(invoice?.created_at);
  const formattedCreationDate = new Intl.DateTimeFormat(
    "en-CA"
  ).format(creationDate);

  return (
    <div id="pelcro-invoice-details-view">
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <InvoiceDetailsContainer {...props}>
          <div className="plc-mt-5 pelcro-invoice-summary-wrapper">
            <p className="plc-font-bold pelcro-invoice-summary-title">
              {t("labels.summary")}
            </p>
            {invoice && (
              <>
                <p className="plc-mr-2 pelcro-invoice-creation-date">
                  {`${t(
                    "labels.creationDate"
                  )} ${formattedCreationDate}`}
                </p>
                {hasPlanDetails && (
                  <div className="plc-flex plc-items-center plc-pt-2 plc-mt-2 plc-border-t plc-border-gray-400 plc-min-h-12 plc-justify-between pelcro-invoice-plan-wrapper">
                    <div className="plc-break-words pelcro-invoice-plan-name">
                      {invoice.plan.nickname}
                    </div>
                    <div className="plc-text-center pelcro-invoice-summary-price">
                      {calcAndFormatItemsTotal(
                        [invoice.plan],
                        invoice.currency
                      )}
                    </div>
                  </div>
                )}
                <div className="plc-flex plc-justify-end plc-pt-2 plc-mt-2 plc-font-bold plc-border-t plc-border-gray-400 pelcro-invoice-total-wrapper">
                  <div className="plc-mr-2 plc-flex plc-flex-col">
                    <p className="pelcro-invoice-total-text">
                      {t("labels.total")}
                    </p>
                    <p className="pelcro-invoice-total-text">
                      {t("labels.amountPaid")}
                    </p>
                    <p className="plc-font-semibold pelcro-invoice-total-text">
                      {t("labels.amountDue")}
                    </p>
                  </div>
                  <div className="plc-flex plc-flex-col plc-items-end">
                    <p className="pelcro-invoice-total">
                      {getFormattedPriceByLocal(
                        invoice.total,
                        invoice.currency,
                        getPageOrDefaultLanguage()
                      )}
                    </p>
                    <p className="pelcro-invoice-total">
                      {invoice.paid && invoice.amount_paid === 0
                        ? getFormattedPriceByLocal(
                            invoice.total,
                            invoice.currency,
                            getPageOrDefaultLanguage()
                          )
                        : getFormattedPriceByLocal(
                            invoice.amount_paid,
                            invoice.currency,
                            getPageOrDefaultLanguage()
                          )}
                    </p>
                    <p className="plc-font-semibold pelcro-invoice-total">
                      {invoice.paid
                        ? getFormattedPriceByLocal(
                            0,
                            invoice.currency,
                            getPageOrDefaultLanguage()
                          )
                        : getFormattedPriceByLocal(
                            invoice.amount_remaining,
                            invoice.currency,
                            getPageOrDefaultLanguage()
                          )}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="plc-flex plc-items-center plc-justify-center plc-mt-4">
            {showDownloadButton && (
              <InvoiceDetailsDownloadButton
                url={invoice?.invoice_pdf}
                className="plc-w-full plc-text-center"
              />
            )}
            {showPayButton && (
              <InvoiceDetailsPayButton
                role="submit"
                className="plc-ml-4 plc-w-full"
                id="pelcro-submit"
              />
            )}
          </div>
        </InvoiceDetailsContainer>
      </form>
    </div>
  );
};

function canPayInvoice(invoice) {
  return invoice?.status === "open" || invoice?.status === "past_due";
}
