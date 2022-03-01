import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";

export const InvoiceDetailsDownloadButton = ({
  name,
  url,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation("invoiceDetails");
  const { invoice } = usePelcro();

  return (
    <Link
      className={`plc-px-6 plc-py-2 plc-uppercase plc-bg-transparent plc-text-primary-500 plc-border plc-border-primary-500 plc-rounded focus:plc-outline-none focus:plc-ring-2 focus:plc-ring-primary-300 plc-tracking-wider hover:plc-bg-primary-600 focus:plc-bg-primary-600 hover:plc-text-white focus:plc-text-white hover:plc-shadow-none plc-no-underline ${className}`}
      id="pelcro-download-invoice-link"
      href={url ?? invoice?.invoice_pdf}
      target="_blank"
      rel="noopener noreferrer"
      {...otherProps}
    >
      {name ?? t("buttons.download")}
    </Link>
  );
};
