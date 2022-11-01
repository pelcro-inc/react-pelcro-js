import React from "react";
import { useTranslation } from "react-i18next";
import {
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../../utils/utils";
import { ReactComponent as ChevronRightIcon } from "../../../assets/chevron-right.svg";
import { Accordion } from "../Accordion";
import { Card } from "../Card";

export const OrdersMenu = () => {
  const { t } = useTranslation("dashboard");
  const userOrders = window.Pelcro.user.read().orders;

  return (
    <Card
      id="pelcro-dashboard-orders-menu"
      className="plc-max-w-80% plc-m-auto"
      title={t("labels.orders.label")}
    >
      <table className="plc-w-full plc-py-4 plc-table-fixed plc-text-left">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-w-4/12 plc-pl-2">
              {t("labels.orders.total")}
            </th>
            <th className="plc-w-5/12 ">{t("labels.orders.date")}</th>
            <th className="plc-w-3/12">
              {t("labels.orders.details")}
            </th>
          </tr>
        </thead>
        {/* Spacer */}
        <tbody>
          <tr className="plc-h-4"></tr>
        </tbody>
        <Accordion>
          <OrderItems orders={userOrders} />
        </Accordion>
        <tbody>
          <tr className="plc-h-4"></tr>
        </tbody>
      </table>
    </Card>
  );
};

export const OrderItems = ({
  orders,
  activeMenu,
  toggleActiveMenu
}) => {
  const getItemsAmount = (orderId) => {
    return orders
      ?.find((order) => order.id === orderId)
      .items.reduce((amount, order) => amount + order.quantity, 0);
  };

  const { t } = useTranslation("dashboard");

  if (orders?.length === 0) return null;
  
  return !orders?.length ? null : (
    orders?.map((order) => {
      const isActive = activeMenu === order.id;

      return (
        <React.Fragment key={order.id}>
          {/* Accordion header */}
          <tbody>
            <tr
              onClick={() => toggleActiveMenu(order.id)}
              key={"dashboard-order-" + order.id}
              className={`plc-w-full plc-text-gray-500 plc-align-middle plc-cursor-pointer accordion-header ${
                isActive ? "plc-bg-gray-100" : "hover:plc-bg-gray-50"
              }`}
            >
              <td className="plc-py-4 plc-pl-2">
                <span className="plc-text-xl plc-font-semibold ">
                  {getFormattedPriceByLocal(
                    order.amount,
                    order.currency,
                    getPageOrDefaultLanguage()
                  )}
                </span>
                <br />
                <span className="plc-text-xs plc-text-gray-400 plc-uppercase">
                  {t("labels.orders.itemsAmount", {
                    count: getItemsAmount(order.id)
                  })}
                </span>
              </td>
              <td>
                <p className="plc-font-semibold ">{order.created}</p>
              </td>

              <td>
                <div
                  className={`plc-flex plc-items-center plc-justify-center plc-transition-transform plc-ease-out plc-transform plc-rounded-full plc-w-7 plc-h-7 ${
                    isActive
                      ? "plc-flex plc-place-items-center plc-w-7 plc-h-7 plc-p-1 plc-bg-primary-400 plc-rounded-full"
                      : "accordion-chevron"
                  }`}
                >
                  <span
                    className={`plc-transition plc-ease-out  ${
                      isActive &&
                      "plc-text-white plc-transform plc-rotate-90"
                    }`}
                  >
                    <ChevronRightIcon />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>

          {/* Accordion active menu */}
          <tbody>
            {isActive && (
              <>
                {order.items.map((item) => {
                  const productSku =
                    window.Pelcro.ecommerce.products.getBySkuId(
                      item.product_sku_id
                    );

                  return (
                    <tr
                      key={item.id}
                      className="plc-text-lg plc-text-gray-500 pelcro-order-details-row "
                    >
                      <td colSpan="2">
                        <div className="plc-flex plc-items-center plc-py-2 plc-space-x-2 sm:plc-p-2">
                          {productSku?.image && (
                            <img
                              className="plc-w-12 plc-h-12 pelcro-orders-product-image"
                              alt={`image of ${item.product_sku_name}`}
                              src={productSku?.image}
                            />
                          )}
                          <span className="plc-font-semibold">
                            {item.quantity}×{" "}
                          </span>
                          <span className="">
                            {item.product_sku_name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="plc-font-semibold">
                          {getFormattedPriceByLocal(
                            item.amount,
                            order.currency,
                            getPageOrDefaultLanguage()
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="3">
                    <hr className="plc-mt-4" />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </React.Fragment>
      );
    })
  );
};
