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
      className="plc-subscriptions-menu-width"
      title={t("labels.orders.label")}
    >
      <div className="plc--mx-4 plc--my-2 plc-overflow-x-auto plc-sm:-mx-6 plc-lg:-mx-8">
        <div className="plc-inline-block plc-min-w-full plc-py-2 plc-align-middle">
          <table className="plc-min-w-full plc-divide-y plc-divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="plc-py-3.5 plc-pr-3 plc-pl-4 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-sm:pl-6 plc-lg:pl-8 plc-uppercase"
                >
                  {t("labels.orders.number")}
                </th>
                <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-uppercase">
                  {t("labels.orders.date")}
                </th>
                <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-uppercase">
                  {t("labels.orders.total")}
                </th>
                <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-uppercase">
                  {t("labels.orders.items")}
                </th>
                <th scope="col" className="plc-px-3 plc-py-3.5 plc-text-left plc-text-sm plc-font-medium plc-text-gray-900 plc-uppercase">
                  {t("labels.orders.status")}
                </th>
                <th scope="col" className="plc-relative plc-py-3.5 plc-pr-4 plc-text-sm plc-font-medium plc-pl-3 plc-sm:pr-6 plc-lg:pr-8 plc-text-gray-900 plc-text-right">

                </th>
              </tr>
            </thead>

            <Accordion>
              <OrderItems orders={userOrders} />
            </Accordion>

          </table>
        </div>
      </div>
    </Card >
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

  if (orders?.length === 0) return (
    <tbody>
      <tr>
        <td colSpan="6" className="plc-text-center plc-py-4">
          <span className="plc-text-gray-500">No orders found</span>
        </td>
      </tr>
    </tbody>
  );

  return !orders?.length
    ? null
    : orders?.map((order) => {
      const isActive = activeMenu === order.id;

      return (
        <React.Fragment key={order.id}>
          <tbody className="plc-divide-y plc-divide-gray-200 plc-bg-white">
            {/* Accordion header */}
            <tr
              onClick={() => toggleActiveMenu(order.id)}
              key={"dashboard-order-" + order.id}
              toggleActiveMenu
              className={`hover:plc-bg-gray-50 ${isActive ? "plc-bg-gray-100" : ""}`}
            >
              <td className="plc-py-4 plc-pr-3 plc-pl-4 plc-text-sm plc-font-medium plc-whitespace-nowrap plc-text-gray-900 plc-sm:pl-6 plc-lg:pl-8">
                <span className="plc-font-medium plc-text-gray-900">
                  {`#${order.id}`}
                </span>
              </td>
              <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-500">
                <span className=" plc-text-gray-500">
                  {order?.items?.[0].created_at}
                </span>
              </td>
              <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-500">
                <span className=" plc-text-gray-900">
                  {getItemsAmount(order.id)}
                </span>
              </td>
              <td className="plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-500">
                <span className=" plc-text-gray-500">
                  {getFormattedPriceByLocal(
                    order.amount,
                    order.currency,
                    getPageOrDefaultLanguage()
                  )}
                </span>
              </td>

              <td className={`plc-px-3 plc-py-4 plc-text-sm plc-whitespace-nowrap plc-text-gray-500
               ${order.status === "pending" ? "plc-text-yellow-500" : order.status == 'paid' ? "plc-text-green-500" : "plc-text-red-500"}
               
              `}>
                {order.status}
              </td>


              <td className="plc-cursor-pointer">
                <div
                  className={`plc-flex plc-items-center plc-justify-center plc-transition-transform plc-ease-out plc-transform plc-rounded-full plc-w-7 plc-h-7 ${isActive
                    ? "plc-flex plc-place-items-center plc-w-7 plc-h-7 plc-p-1 plc-bg-primary-400 plc-rounded-full"
                    : "accordion-chevron"
                    }`}
                >
                  <span
                    className={`plc-transition plc-ease-out  ${isActive &&
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
          <tbody className="plc-w-full">
            {isActive && (
              <>
                {order.items.map((item) => {
                  const productSku =
                    window.Pelcro.ecommerce.products.getBySkuId(item.product_sku_id);

                  return (
                    <tr
                      key={item.id}
                      className="plc-text-lg plc-text-gray-600 plc-transition-all plc-duration-300 plc-ease-in-out hover:plc-bg-gray-50 plc-w-full"
                    >
                      <td colSpan="6" className="plc-p-0 plc-w-full">
                        <div className="plc-flex plc-items-center plc-justify-between plc-py-4 plc-px-6 plc-rounded-lg plc-w-full plc-shadow-md plc-bg-white hover:plc-shadow-lg plc-transition-all">
                          <div className="plc-flex plc-items-center plc-space-x-4">
                            {productSku?.image ? (
                              <img
                                className="plc-w-16 plc-h-16 plc-object-cover plc-rounded-md plc-shadow-md"
                                alt={`image of ${item.product_sku_name}`}
                                src={productSku?.image}
                              />
                            ) : (
                              <div className="plc-w-16 plc-h-16 plc-bg-gray-200 plc-rounded-md plc-flex plc-items-center plc-justify-center">
                                <span className="plc-text-gray-400 plc-text-xs">No image</span>
                              </div>
                            )}
                            <div className="plc-flex plc-flex-col">
                              <span className="plc-font-semibold plc-text-gray-900 plc-mb-1">
                                {item.product_sku_name}
                              </span>
                              <span className="plc-text-sm plc-text-gray-600 plc-bg-gray-100 plc-px-3 plc-py-1 plc-rounded-full plc-inline-block">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="plc-ml-auto">
                            <span className="plc-font-semibold plc-text-gray-900 plc-bg-blue-50 plc-px-4 plc-py-2 plc-rounded-full">
                              {getFormattedPriceByLocal(
                                item.amount,
                                order.currency,
                                getPageOrDefaultLanguage()
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>

        </React.Fragment>
      );
    });
};

OrdersMenu.viewId = "orders";
