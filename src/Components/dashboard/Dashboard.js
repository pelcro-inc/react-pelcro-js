import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";
import { DashboardContainer } from "./DashboardContainer";
import { DashboardContent } from "./DashboardContent";
import { DashboardHeading } from "./DashboardHeading";
import { DashboardProfile } from "./DashboardLinks/DashboardProfile";
import { DashboardQRCode } from "./DashboardLinks/DashboardQRCode";
import { DashboardPasswordChange } from "./DashboardLinks/DashboardPasswordChange";
import { DashboardSavedItems } from "./DashboardLinks/DashboardSavedItems";
import { DashboardPaymentCards } from "./DashboardLinks/DashboardPaymentCards";
import { DashboardAddresses } from "./DashboardLinks/DashboardAddresses";
import { DashboardSubscriptions } from "./DashboardLinks/DashboardSubscriptions";
import { DashboardNewsletters } from "./DashboardLinks/DashboardNewsletters";
import { DashboardMemberships } from "./DashboardLinks/DashboardMemberships";
import { DashboardDonations } from "./DashboardLinks/DashboardDonations";
import { DashboardGifts } from "./DashboardLinks/DashboardGifts";
import { DashboardOrders } from "./DashboardLinks/DashboardOrders";
import { DashboardInvoices } from "./DashboardLinks/DashboardInvoices";

/**
 *
 */
export function Dashboard({ dashboardLayout = "left", ...props }) {
  React.useEffect(() => {
    props.onDisplay?.();
  }, []);

  const { resetView } = usePelcro();
  const { t } = useTranslation("dashboard");

  return (
    <DashboardContainer {...props}>
      <DashboardContent
        onClose={() => {
          props.onClose?.();
          resetView();
        }}
        dashboardLayout={dashboardLayout}
        {...props}
      >
        <DashboardHeading title={t("labels.mySettings")} />
        <DashboardProfile />
        <DashboardQRCode />
        <DashboardPasswordChange />
        <DashboardSavedItems />

        <DashboardHeading title={t("labels.accountSettings")} />
        <DashboardPaymentCards />
        <DashboardAddresses />
        <DashboardHeading title={t("labels.purchases")} />

        <DashboardSubscriptions />
        <DashboardNewsletters />
        <DashboardMemberships />
        <DashboardDonations />
        <DashboardGifts />
        <DashboardOrders />
        <DashboardInvoices />
      </DashboardContent>
    </DashboardContainer>
  );
}

Dashboard.viewId = "dashboard";
