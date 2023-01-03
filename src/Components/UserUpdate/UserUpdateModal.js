import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
// import { UserUpdateView } from "./UserUpdateView";
const UserUpdateView = lazy(() =>
  import("./UserUpdateView").then((module) => {
    return { default: module.UserUpdateView };
  })
);

/**
 *
 */
export function UserUpdateModal({
  onClose,
  onDisplay,
  ...otherProps
}) {
  const { switchView } = usePelcro();
  const { t } = useTranslation("userEdit");

  const onPictureClick = () => {
    switchView("profile-picture");
  };

  return (
    <Modal
      id="pelcro-user-update-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("labels.title")}
          </h4>
          <p>{t("labels.subtitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <UserUpdateView
            onPictureClick={onPictureClick}
            {...otherProps}
          />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

UserUpdateModal.viewId = "user-edit";
