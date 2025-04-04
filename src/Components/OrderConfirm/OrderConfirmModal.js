import React from "react";
import Authorship from "../common/Authorship";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMark } from "../../assets/check-solid.svg";
import { Badge } from "../../SubComponents/Badge";
import {
  calcAndFormatItemsTotal,
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import { usePelcro } from "../../hooks/usePelcro";

export const OrderConfirmModal = (props) => {
  const userOrders = window.Pelcro.user.read().orders;
  const latestOrder = userOrders?.[userOrders.length - 1];
  const latestOrderDiscount = latestOrder?.coupon?.percent_off;

  const { t } = useTranslation("shop");
  const { resetView } = usePelcro();
  const [open, setOpen] = React.useState(true);

  const onClose = () => {
    props?.onClose?.();
    resetView();
  };

  return (
    <Modal
      id="pelcro-order-confirm-modal"
      className="plc-max-w-2xl plc-border-t-8 plc-border-primary-500"
      onClose={onClose}
      onDisplay={props.onDisplay}
      isOpen={open}
      onCloseModal={() => setOpen(false)}
    >
      <ModalHeader
        hideCloseButton={false}
        title={t("messages.orderConfirmed.title")}
        description={t("messages.orderConfirmed.body")}
        showTitleInLeft={false}
      >
        <div className="plc-flex plc-justify-center plc-mt-4">
          <CheckMark className="plc-w-24 plc-h-24 plc-text-green-500" />
        </div>
      </ModalHeader>

      <ModalBody className="plc-mt-4">
        <div id="pelcro-order-confirm-view">
          <div className="plc-text-center plc-text-gray-600 plc-mb-6">
            <p>{t("messages.haveQuestions")}</p>
          </div>

          <div className="plc-mt-5 plc-bg-gray-50 plc-p-4 plc-rounded-lg plc-shadow-sm">
            <p className="plc-font-bold plc-text-gray-800 plc-mb-3 plc-text-lg">
              {t("labels.summary")}
            </p>

            {latestOrder?.items.map((item) => {
              const itemImage = window.Pelcro.ecommerce.products.getBySkuId(
                item.product_sku_id
              ).image;

              return (
                <div
                  key={item.product_sku_id}
                  id={`pelcro-summary-product-${item.product_sku_id}`}
                  className="plc-flex plc-items-center  plc-mt-3 plc-border-b plc-border-gray-200 plc-min-h-8 plc-justify-between plc-pb-2"
                >
                  <div className="plc-flex plc-items-center plc-gap-4">
                    <div className="pelcro-summary-image-wrapper">
                      {itemImage && (
                        <Badge content={item.quantity}>
                          <img
                            className="plc-object-contain plc-w-16 plc-h-16 plc-rounded-md"
                            alt={`image of ${item.product_sku_name}`}
                            src={itemImage}
                          />
                        </Badge>
                      )}
                    </div>
                    <div className="plc-break-words plc-text-gray-700">
                      {item.product_sku_name}
                    </div>
                  </div>
                  <div className="plc-text-right plc-font-medium plc-text-gray-900">
                    {calcAndFormatItemsTotal([item], latestOrder?.currency)}
                  </div>
                </div>
              );
            })}

            <div className="plc-flex plc-items-center plc-justify-between plc-pt-3 plc-mt-3 plc-font-medium plc-text-gray-600 ">
              <dt>{t("labels.shippingRate")}</dt>
              <dd className="plc-text-gray-900">
                {getFormattedPriceByLocal(
                  latestOrder.shipping_rate,
                  latestOrder?.currency,
                  getPageOrDefaultLanguage()
                )}
              </dd>
            </div>

            <div className="plc-flex plc-items-center plc-justify-between plc-pt-4 plc-mt-4 plc-font-bold plc-border-t plc-border-gray-300 plc-text-lg">
              <dt>{t("labels.total")}</dt>
              <dd className="plc-text-primary-600">
                {latestOrderDiscount && (
                  <span className="plc-text-green-600 plc-text-sm plc-font-medium plc-mr-2">
                    (-{latestOrderDiscount}%)
                  </span>
                )}
                {getFormattedPriceByLocal(
                  latestOrder?.amount,
                  latestOrder?.currency,
                  getPageOrDefaultLanguage()
                )}
              </dd>
            </div>
          </div>

          {/* <div className="plc-flex plc-justify-center plc-mt-8">
            <Button
              id="pelcro-submit"
              onClick={onClose}
              autoFocus={true}
              className="plc-w-full plc-max-w-xs plc-py-3"
            >
              {t("buttons.continue")}
            </Button>
          </div> */}
        </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
OrderConfirmModal.viewId = "order-confirm";
