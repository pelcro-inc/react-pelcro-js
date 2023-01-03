import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
// import { NewsletterUpdateView } from "./NewsletterUpdateView";
const NewsletterUpdateView = lazy(() =>
  import("./NewsletterUpdateView").then((module) => {
    return { default: module.NewsletterUpdateView };
  })
);

export const NewsletterUpdateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("newsletter");

  return (
    <Modal
      id="pelcro-newsletter-update-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("updateTitle")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <NewsletterUpdateView {...otherProps} />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

NewsletterUpdateModal.viewId = "newsletter-update";
