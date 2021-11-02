import React from "react";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { NewsletterUpdateContainer } from "./NewsletterUpdateContainer";
import { NewsletterUpdateButton } from "./NewsletterUpdateButton";
import { NewsletterUpdateList } from "./NewsletterUpdateList";

export const NewsletterUpdateView = (props) => {
  const { t } = useTranslation("newsletter");

  return (
    <div id="pelcro-newsletter-update-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("updateTitle")}
        </h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <NewsletterUpdateContainer {...props}>
          <AlertWithContext />
          <NewsletterUpdateList />
          <NewsletterUpdateButton
            role="submit"
            className="plc-mt-4 plc-w-full"
            name={t("labels.submit")}
            id="pelcro-submit"
          />
        </NewsletterUpdateContainer>
      </form>
    </div>
  );
};
