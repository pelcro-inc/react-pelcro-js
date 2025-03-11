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
import { TableEmptyState } from "../../../SubComponents/TableEmptyState";
import { ReactComponent as ArrowRight } from "../../../assets/arrow-right.svg";
export const InvoicesMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const invoices =
    window.Pelcro.invoice
      .list()
      ?.filter((invoice) => invoice.order_id || invoice.total > 0) ??
    [];

  if (invoices.length === 0) {
    return (
      <Card
        id="pelcro-dashboard-invoices-menu"
        className="plc-max-w-100% md:plc-max-w-80% plc-m-auto"
        title={t("labels.invoices")}
      >
        <TableEmptyState
          message={t("labels.noInvoices")}
          colSpan={5}
          className="plc-bg-white plc-my-5"
          hideHeader={true}
        />
      </Card>
    );
  }

  return (
    <Card
      id="pelcro-dashboard-invoices-menu"
      title={t("labels.invoices")}
      description={t("labels.invoicesDescription")}
      className="plc-subscriptions-menu-width"
    >
      <div className="plc-flow-root">
        <div className="plc--mx-4 plc--my-2 plc-overflow-x-auto plc-sm:-mx-6 plc-lg:-mx-8">
          <div className="plc-inline-block plc-min-w-full plc-py-2 plc-align-middle">
            <div className="plc-max-h-[500px] plc-overflow-y-auto plc-scrollbar-hide">
              <table className="plc-min-w-full plc-divide-y plc-divide-gray-300">
                <thead className="plc-sticky plc-top-0 plc-bg-white plc-z-10">
                  <tr>
                    <th
                      scope="col"
                      className="plc-py-3.5 plc-pr-3 plc-pl-4 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-sm:pl-6 plc-lg:pl-8 plc-uppercase"
                    >
                      {t("labels.details")}
                    </th>
                    <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-uppercase">
                      {t("labels.orders.date")}
                    </th>
                    <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-uppercase">
                      {t("labels.orders.total")}
                    </th>
                    <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-uppercase">
                      {t("labels.status.title")}
                    </th>
                    <th scope="col" className="plc-relative plc-py-3.5 plc-pr-4 plc-text-sm plc-font-medium plc-pl-3 plc-sm:pr-6 plc-lg:pr-8 plc-text-gray-900 plc-text-right">

                    </th>
                  </tr>
                </thead>
                <tbody className="plc-divide-y plc-divide-gray-200 plc-bg-white">
                  <InvoicesItems {...props} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const InvoicesItems = () => {
  const { t } = useTranslation("dashboard");

  const { setInvoice, switchView } = usePelcro();
  const invoices =
    window.Pelcro.invoice
      .list()
      ?.filter((invoice) => invoice.order_id || invoice.total > 0) ??
    [];

  const showInvoiceDetails = (invoice) => {
    if (setInvoice(invoice.id)) {
      switchView("invoice-details");
    }
  };

  if (invoices.length === 0) {
    return (
      <TableEmptyState
        message={t("labels.noInvoices")}
        colSpan={5}
        className="plc-bg-white plc-my-6"
      />
    );
  }

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
          className="hover:plc-bg-gray-50"
        >
          <td className="plc-py-4 plc-pr-3 plc-pl-4 plc-text-sm plc-font-medium plc-whitespace-nowrap plc-text-gray-900 plc-sm:pl-6 plc-lg:pl-8">
            <span className="plc-font-medium plc-text-gray-900">
              {`#${invoice.id}`}
            </span>
            {/* <div className="plc-inline md:plc-hidden">
              <br />
              <span className="plc-text-sm plc-text-gray-400 plc-font-medium">
                {getFormattedPriceByLocal(
                  invoice.total,
                  invoice.currency,
                  getPageOrDefaultLanguage()
                )}
              </span>
              <br />
              <span className="plc-text-sm plc-text-gray-500 plc-font-medium">
                {formattedCreationDate}
              </span>
            </div> */}
          </td>

          <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-500">
            <span className=" plc-text-gray-500">
              {formattedCreationDate}
            </span>
          </td>

          <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-900">
            <span className=" plc-text-gray-500">
              {getFormattedPriceByLocal(
                invoice.total,
                invoice.currency,
                getPageOrDefaultLanguage()
              )}
            </span>
          </td>

          <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap">
            <div className="plc-flex plc-items-center">
              <span
                className={`plc-inline-flex plc-text-xs plc-font-medium  plc-capitalize
                    ${getInvoiceStatus(invoice).textColor} plc-rounded-lg`}
              >
                {invoiceStatus.icon}
                {invoiceStatus.title}
              </span>
            </div>
          </td>

          <td className="plc-relative plc-py-4 plc-pr-4 plc-text-right plc-text-sm plc-font-medium plc-sm:pr-6 plc-lg:pr-8">
            <Button
              variant="ghost"
              className="plc-inline-flex plc-items-center plc-gap-2 plc-text-sm plc-font-medium plc-text-gray-900 hover:plc-text-gray-600 plc-whitespace-nowrap
               plc-justify-center plc-align-center
              "
              onClick={() => showInvoiceDetails(invoice)}
            >
              <span className="plc-text-sm">
                {t("labels.viewInvoice")}
              </span>
              <div className='plc-flex plc-items-center plc-justify-center plc-mt-1'>
                <ArrowRight className="plc-w-4 plc-h-4" />
              </div>
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

InvoicesMenu.viewId = "invoices";
