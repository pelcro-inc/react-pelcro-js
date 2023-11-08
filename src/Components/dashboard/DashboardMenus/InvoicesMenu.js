import React from "react";
import { Button } from "../../../SubComponents/Button";
import { useTranslation } from "react-i18next";
import { ReactComponent as XCircleIcon } from "../../../assets/x-icon-solid.svg";
import { ReactComponent as EditIcon } from "../../../assets/edit.svg";
import { ReactComponent as ExclamationIcon } from "../../../assets/exclamation.svg";
import { ReactComponent as CheckMarkIcon } from "../../../assets/check-mark.svg";
import { ReactComponent as InvoiceIcon } from "../../../assets/document.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/calendar.svg";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../../utils/utils";
import { usePelcro } from "../../../hooks/usePelcro";
import i18n from "../../../i18n";
import { Card } from "../Card";

export const InvoicesMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-invoices-menu"
      className="plc-max-w-100% md:plc-max-w-80% plc-m-auto"
      title={t("labels.invoices")}
    >
      <table className="plc-w-full plc-table-fixed pelcro-invoices-table plc-text-left">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-w-1/3 md:plc-w-1/5">{t("labels.details")}</th>
            <th className="plc-hidden md:plc-table-cell plc-w-1/5">{t("labels.orders.date")}</th>
            <th className="plc-hidden md:plc-table-cell plc-w-1/5">{t("labels.orders.total")}</th>
            <th className="plc-w-1/3 md:plc-w-1/5">{t("labels.status.title")}</th>
            <th className="plc-w-1/3 md:plc-w-1/5">{t("labels.actions")}</th>
          </tr>
        </thead>
        <tbody>
          <InvoicesItems {...props} />
        </tbody>
      </table>
    </Card>
  );
};

const InvoicesItems = () => {
  const { t } = useTranslation("dashboard");

  const { setInvoice, switchView } = usePelcro();
  const invoices =
    window.Pelcro.invoice
      .list()
      ?.filter((invoice) => invoice.order_id || invoice.total > 0) ?? [];

  const showInvoiceDetails = (event) => {
    if (setInvoice(event.target.dataset.id)) {
      switchView("invoice-details");
    }
  };

  if (invoices.length === 0) return null;

  return invoices
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .map((invoice) => {
      const invoiceStatus = getInvoiceStatus(invoice);
      const formattedCreationDate = new Intl.DateTimeFormat(
        "en-CA"
      ).format(new Date(invoice.created_at));

      return (
        <tr
          key={invoice.id}
          className={`plc-w-full plc-align-middle plc-cursor-pointer accordion-header`}
        >
          <td className="plc-truncate">
            <span className="plc-font-semibold plc-text-gray-500">
              {`#${invoice.id}`}
            </span>
            <div className="plc-inline md:plc-hidden">
              <br />
              <span className="plc-text-sm plc-text-gray-500">
                {getFormattedPriceByLocal(
                  invoice.total,
                  invoice.currency,
                  getPageOrDefaultLanguage()
                )}
              </span>
              <br />
              <span className="plc-text-sm plc-text-gray-500">
                {formattedCreationDate}
              </span>
            </div>
          </td>

          <td className="plc-hidden md:plc-table-cell">
            <span className="plc-text-sm plc-text-gray-500">
              {formattedCreationDate}
            </span>
          </td>

          <td className="plc-hidden md:plc-table-cell">
            <span className="plc-text-sm plc-text-gray-500">
              {getFormattedPriceByLocal(
                invoice.total,
                invoice.currency,
                getPageOrDefaultLanguage()
              )}
            </span>
          </td>

          <td className="plc-py-2">
            {/* Pill */}
            <span
              className={`plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold ${invoiceStatus.bgColor} plc-uppercase ${invoiceStatus.textColor} plc-rounded-lg`}
            >
              {invoiceStatus.icon}
              {invoiceStatus.title}
            </span>
          </td>

          <td>
            <Button
              variant="ghost"
              className="plc-text-blue-400 focus:plc-ring-blue-400 pelcro-dashboard-view-invoice-button"
              icon={<InvoiceIcon className="plc-w-4 plc-h-4" />}
              onClick={showInvoiceDetails}
              data-id={invoice.id}
            >
              {t("labels.view")}
            </Button>
          </td>
        </tr>
      );
    });
};

function getInvoiceStatus(invoice) {
  const translations = i18n.t("dashboard:labels", {
    returnObjects: true
  });

  switch (invoice.status) {
    case "paid":
      return {
        textColor: "plc-text-green-700",
        bgColor: "plc-bg-green-100",
        icon: <CheckMarkIcon />,
        title: translations.paid
      };

    case "past_due":
      return {
        textColor: "plc-text-orange-700",
        bgColor: "plc-bg-orange-100",
        icon: <ExclamationIcon />,
        title: translations.pastDue
      };

    case "open":
      return {
        textColor: "plc-text-yellow-700",
        bgColor: "plc-bg-yellow-100",
        icon: <ExclamationIcon />,
        title: translations.open
      };

    case "draft":
      return {
        textColor: "plc-text-blue-700",
        bgColor: "plc-bg-blue-100",
        icon: <EditIcon />,
        title: translations.draft
      };

    case "scheduled":
      return {
        textColor: "plc-text-blue-700",
        bgColor: "plc-bg-blue-100",
        icon: <CalendarIcon />,
        title: translations.scheduled
      };

    case "uncollectible":
      return {
        textColor: "plc-text-red-700",
        bgColor: "plc-bg-red-100",
        icon: <XCircleIcon />,
        title: translations.uncollectible
      };

    case "void":
      return {
        textColor: "plc-text-gray-700",
        bgColor: "plc-bg-gray-100",
        icon: <XCircleIcon />,
        title: translations.void
      };
  }
}
