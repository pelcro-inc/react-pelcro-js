import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import { RegisterView } from "./RegisterView";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal"
/**
 *
 */
export function RegisterModal(props) {
  const { t } = useTranslation("register");
  const [open, setOpen] = React.useState(true);

  const {
    switchView,
    resetView,
    switchToAddressView,
    switchToPaymentView,
    product,
    plan,
    order,
    giftCode,
    isGift
  } = usePelcro();

  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

  const onSuccess = (res) => {
    props.onSuccess?.(res);

    handleAfterRegistrationLogic();
  };

  const handleAfterRegistrationLogic = () => {
    if (enableReactGA4) {
      ReactGA4.event("Registered", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Registered",
        nonInteraction: true
      });
    }

    const isEmailVerificationEnabled =
      window.Pelcro.site.read()?.email_verify_enabled ?? false;

    if (isEmailVerificationEnabled) {
      return switchView("email-verify");
    }

    if (!product && !order && !giftCode) {
      // If product and plan are not selected
      return resetView();
    }

    // If this is a redeem gift
    if (giftCode) {
      return switchView("gift-redeem");
      // return switchToAddressView();
    }

    // Check if the subscription is meant as a gift (if so, gather recipients info)
    if (isGift) {
      return switchView("gift-create");
    }

    if (order) {
      return switchToAddressView();
    }

    if (product && plan) {
      if (product.address_required) {
        return switchToAddressView();
      } else {
        return switchToPaymentView();
      }
    }

    if (product && !plan) {
      return switchView("plan-select");
    }

    return resetView();
  };

  const title = product?.paywall?.register_title ?? t("title");
  const subtitle =
    product?.paywall?.register_subtitle ?? t("subtitle");

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalHeader
        title={title}
        description={subtitle}
      />

      <ModalBody>
        <RegisterView {...props} onSuccess={onSuccess} />
      </ModalBody>

      <ModalFooter>
        <p className="plc-text-center plc-text-sm plc-text-gray-500 plc-mt-8">
          {t("messages.alreadyHaveAccount") + " "}
          <Link
            onClick={() => switchView("login")}
            className="plc-font-medium plc-text-gray-900 plc-transition-colors plc-hover:underline"
          >
            {t("messages.loginHere")}
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
}

RegisterModal.viewId = "register";
