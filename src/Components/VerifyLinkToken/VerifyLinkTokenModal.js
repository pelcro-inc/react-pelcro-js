import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { notify } from "../../SubComponents/Notification";
import { usePelcro } from "../../hooks/usePelcro";
// import { VerifyLinkTokenView } from "./VerifyLinkTokenView";
const VerifyLinkTokenView = lazy(() =>
  import("./VerifyLinkTokenView").then((module) => {
    return { default: module.VerifyLinkTokenView };
  })
);

export function VerifyLinkTokenModal({
  onDisplay,
  onClose,
  ...props
}) {
  const { t } = useTranslation("verifyLinkToken");
  const { resetView } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    resetView();
    notify.success(t("messages.success"));
  };

  return (
    <Modal
      id="pelcro-login-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold ">
            {t("labels.title")}
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <VerifyLinkTokenView {...props} onSuccess={onSuccess} />
        </Suspense>
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
}

VerifyLinkTokenModal.viewId = "passwordless-login";
