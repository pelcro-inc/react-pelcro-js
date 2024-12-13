import React, { useEffect, useMemo, useState } from "react";
import {
  calcAndFormatItemsTotal,
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import { Loader } from "../../SubComponents/Loader";
import { useTranslation } from "react-i18next";

export const OrderCreateSummary = ({ order, paymentInfo }) => {
  const { t } = useTranslation("shop");

  const [items, setItems] = useState([]);

  useEffect(() => {
    const isQuickPurchase = !Array.isArray(order);
    if (isQuickPurchase) {
      setItems([order]);
    }
    if (order?.length > 0) {
      setItems(order);
    }
  }, [order]);

  const subtotal = useMemo(() => {
    return getFormattedPriceByLocal(
      paymentInfo?.subtotal || 0,
      order?.[0]?.currency,
      getPageOrDefaultLanguage()
    );
  }, [paymentInfo?.subtotal, order]);

  const shippingRate = useMemo(() => {
    return getFormattedPriceByLocal(
      paymentInfo?.shippingRate || 0,
      order?.[0]?.currency,
      getPageOrDefaultLanguage()
    );
  }, [paymentInfo?.shippingRate, order]);

  const taxRate = useMemo(() => {
    if (!paymentInfo?.taxes) {
      return "0";
    }
    return getFormattedPriceByLocal(
      paymentInfo?.taxes || 0,
      order?.[0]?.currency,
      getPageOrDefaultLanguage()
    );
  }, [paymentInfo?.taxes, order]);

  const total = useMemo(() => {
    return getFormattedPriceByLocal(
      paymentInfo?.total || 0,
      order?.[0]?.currency,
      getPageOrDefaultLanguage()
    );
  }, [paymentInfo?.total, order]);

  return (
    <div className="plc-px-8 md:plc-px-0">
      <div className="plc-mx-auto plc-w-full">
        <h2 className="plc-font-semibold">Order summary</h2>

        <div className="plc-flow-root plc-mt-4">
          <ul
            role="list"
            className="plc-divide-y plc-divide-gray-200 plc-overflow-y-auto plc-max-h-checkout"
          >
            {items.map((item) => {
              return (
                <li
                  key={item?.id}
                  className="plc-flex plc-space-x-6 plc-py-6"
                >
                  <img
                    alt="order item image"
                    src={item?.image}
                    className="plc-h-24 plc-w-24 plc-flex-none plc-rounded-md plc-bg-gray-100 plc-object-cover plc-object-center"
                  />
                  <div className="plc-flex-auto">
                    <div className="plc-space-y-1 sm:plc-flex sm:plc-items-start sm:plc-justify-between sm:plc-space-x-6">
                      <div className="plc-flex-auto plc-space-y-1 plc-text-sm plc-font-medium">
                        <h3 className="plc-text-gray-900">
                          {item?.name}
                        </h3>
                        <p className="plc-hidden plc-text-gray-500 sm:plc-block">
                          quantity: {item?.quantity}
                        </p>
                      </div>
                      <div className="plc-flex plc-flex-none plc-space-x-4">
                        <p className="plc-text-gray-900">
                          {item &&
                            item.currency &&
                            calcAndFormatItemsTotal(
                              [item],
                              item?.currency
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {paymentInfo?.total ? (
        <dl className="plc-mt-6 plc-space-y-6 plc-text-sm plc-font-medium plc-text-gray-500">
          <div className="plc-flex plc-justify-between plc-border-t plc-border-gray-200 plc-pt-6 plc-text-gray-900">
            <dt className="plc-text-base">{t("labels.subtotal")}</dt>
            <dd className="plc-text-base">{subtotal}</dd>
          </div>

          <div className="plc-flex plc-justify-between plc-text-gray-900">
            <dt className="plc-text-base">
              {t("labels.shippingRate")}
            </dt>
            <dd className="plc-text-base">{shippingRate}</dd>
          </div>

          {taxRate !== "0" && (
            <div className="plc-flex plc-justify-between plc-text-gray-900">
              <dt className="plc-text-base">{t("labels.tax")}</dt>
              <dd className="plc-text-base">{taxRate}</dd>
            </div>
          )}

          <div className="plc-flex plc-justify-between plc-border-t plc-border-gray-200 plc-pt-6 plc-text-gray-900">
            <dt className="plc-text-base">{t("labels.total")}</dt>
            <dd className="plc-text-base">{total}</dd>
          </div>
        </dl>
      ) : (
        <Loader width={60} height={100} />
      )}
    </div>
  );
};
