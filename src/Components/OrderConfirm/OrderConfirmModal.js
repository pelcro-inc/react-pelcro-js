import React, { useEffect } from "react";
import Authorship from "../common/Authorship";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMark } from "../../assets/check-solid.svg";
import { Badge } from "../../SubComponents/Badge";
import { calcAndFormatItemsTotal } from "../../utils/utils";
import { usePelcro } from "../../hooks/usePelcro";

export const OrderConfirmModal = (props) => {
  const {
    meta: { orderedItems },
    resetView
  } = usePelcro();

  const { t } = useTranslation("shop");

  const onClose = () => {
    props.onClose?.();
    return resetView();
  };

  useEffect(() => {
    props.onDisplay?.();

    const enterKeyHandler = (e) => {
      if (e.key === "Enter") onClose();
    };
    window.addEventListener("keydown", enterKeyHandler);
    return () =>
      window.removeEventListener("keydown", enterKeyHandler);
  }, []);

  return (
    <Modal
      id="pelcro-order-confirm-modal"
      className="plc-border-t-8 plc-border-primary-500"
      onClose={onClose}
      onDisplay={props.onDisplay}
    >
      <ModalBody>
        <div id="pelcro-order-confirm-view">
          <div className="plc-flex plc-flex-col plc-items-center">
            <CheckMark className="plc-w-32 plc-my-4 plc-text-green-500" />
            <div className="plc-text-center plc-text-gray-900">
              <h4 className="plc-mb-4 plc-text-3xl">
                {t("messages.orderConfirmed.title")}
              </h4>
              <p>{t("messages.orderConfirmed.body")}</p>
              <p>{t("messages.haveQuestions")}</p>
            </div>
          </div>
          <div className="plc-mt-5 pelcro-order-summary-wrapper">
            <p className="plc-font-bold pelcro-order-summary-title">
              {t("labels.summary")}
            </p>
            {orderedItems.map((item) => {
              return (
                <div
                  key={item.id}
                  id={`pelcro-summary-product-${item.id}`}
                  className="plc-flex plc-items-center plc-pt-2 plc-mt-2 plc-border-t plc-border-gray-400 plc-min-h-12 plc-justify-evenly pelcro-summary-product-wrapper"
                >
                  <div className="plc-w-1/4 pelcro-summary-image-wrapper">
                    {item.image && (
                      <Badge content={item.quantity}>
                        <img
                          className="plc-object-contain plc-w-20 plc-h-20 pelcro-summary-product-image"
                          alt={`image of ${item.name}`}
                          src={item.image}
                        />
                      </Badge>
                    )}
                  </div>
                  <div className="plc-w-1/2 plc-break-words pelcro-summary-product-name">
                    {item.name}
                  </div>
                  <div className="plc-w-1/5 plc-text-center pelcro-summary-product-price">
                    {calcAndFormatItemsTotal([item])}
                  </div>
                </div>
              );
            })}

            <div className="plc-flex plc-items-center plc-justify-end plc-pt-2 plc-mt-2 plc-font-bold plc-border-t plc-border-gray-400 pelcro-summary-total-wrapper">
              <p className="plc-mr-1 pelcro-summary-total-text">
                {t("labels.total")}
              </p>
              <p className="pelcro-summary-total">
                {calcAndFormatItemsTotal(orderedItems)}
              </p>
            </div>
          </div>
          <div className="plc-flex plc-justify-center plc-mt-6">
            <Button
              id="pelcro-submit"
              onClick={onClose}
              autoFocus={true}
            >
              {t("buttons.continue")}
            </Button>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
OrderConfirmModal.viewId = "order-confirm";
