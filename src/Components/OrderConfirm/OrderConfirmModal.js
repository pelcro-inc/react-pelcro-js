import React from "react";
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
  const userOrders = window.Pelcro.user.read().orders;
  const latestOrder = userOrders?.[userOrders.length - 1];

  const { t } = useTranslation("shop");

  const { resetView } = usePelcro();

  const onClose = () => {
    props?.onClose?.();
    resetView();
  };

  return (
    <Modal
      id="pelcro-order-confirm-modal"
      className="plc-border-t-8 plc-border-primary-500"
      onClose={props.onClose}
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
            {latestOrder?.items.map((item) => {
              const itemImage =
                window.Pelcro.ecommerce.products.getBySkuId(
                  item.product_sku_id
                ).image;

              return (
                <div
                  key={item.product_sku_id}
                  id={`pelcro-summary-product-${item.product_sku_id}`}
                  className="plc-flex plc-items-center plc-pt-2 plc-mt-2 plc-border-t plc-border-gray-400 plc-min-h-12 plc-justify-evenly pelcro-summary-product-wrapper"
                >
                  <div className="plc-w-1/4 pelcro-summary-image-wrapper">
                    {itemImage && (
                      <Badge content={item.quantity}>
                        <img
                          className="plc-object-contain plc-w-20 plc-h-20 pelcro-summary-product-image"
                          alt={`image of ${item.product_sku_name}`}
                          src={itemImage}
                        />
                      </Badge>
                    )}
                  </div>
                  <div className="plc-w-1/2 plc-break-words pelcro-summary-product-name">
                    {item.product_sku_name}
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
                {calcAndFormatItemsTotal(
                  latestOrder?.items,
                  latestOrder?.currency
                )}
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
