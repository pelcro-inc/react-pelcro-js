import React from "react";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";
import { SubscriptionManageMembersView } from "./SubscriptionManageMembersView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

/**
 *
 */
export function SubscriptionManageMembersModal({
  onDisplay,
  onClose,
  ...props
}) {
  const { t } = useTranslation("subscriptionManageMembers");

  const onSuccess = (res) => {
    props.onSuccess?.(res);
  };

  return (
    <Modal
      id="pelcro-manage-members-modal"
      onDisplay={onDisplay}
      onClose={onClose}
      className="plc-max-w-xl"
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("labels.inviteMembers")}
          </h4>
          <p className="plc-text-sm">
            Comma-separated list e.g.
            'john@example.com,jane@example.com'
          </p>
        </div>
      </ModalHeader>
      <ModalBody>
        <SubscriptionManageMembersView
          {...props}
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

SubscriptionManageMembersModal.viewId = "manage-members";
