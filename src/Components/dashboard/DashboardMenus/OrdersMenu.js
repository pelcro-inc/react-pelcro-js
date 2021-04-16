import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../SubComponents/Button";
import { getFormattedPriceByLocal } from "../../../utils/utils";
import { ReactComponent as ChevronRightIcon } from "../../../assets/chevron-right.svg";

export const OrdersMenu = () => {
  const { t } = useTranslation("dashboard");
  const site = window.Pelcro.site.read();
  const getItemsAmount = (orderId) => {
    return window.Pelcro.user
      .read()
      .orders?.find((order) => order.id === orderId)
      .items.reduce((amount, order) => amount + order.quantity, 0);
  };

  const [activeMenu, setActiveMenu] = useState();

  const toggleActiveMenu = (menuToToggle) => {
    if (activeMenu === menuToToggle) {
      setActiveMenu("");
    } else {
      setActiveMenu(menuToToggle);
    }
  };

  const orders = window.Pelcro.user.read().orders?.map((order) => {
    const isActive = activeMenu === order.id;

    return (
      <>
        <tbody>
          <tr
            onClick={() => toggleActiveMenu(order.id)}
            key={"dashboard-subscription-" + order.id}
            className={`plc-w-full plc-text-gray-500 plc-align-middle plc-cursor-pointer accordion-header ${
              isActive ? "plc-bg-gray-100" : "hover:plc-bg-gray-50"
            }`}
          >
            <td className="plc-py-4 plc-pl-2">
              <span className="plc-text-xl plc-font-semibold ">
                {getFormattedPriceByLocal(
                  order.amount,
                  order.currency,
                  site.default_locale
                )}
              </span>
              <br />
              <span className="plc-text-xs plc-text-gray-400 plc-uppercase">
                {getItemsAmount(order.id)} items
              </span>
            </td>
            <td className="plc-py-4 plc-text-lg">
              <p className="">{order.created}</p>
            </td>

            <td className="plc-py-4">
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
        <tbody>
          {isActive &&
            order.items.map((item) => {
              return (
                <tr
                  key={item.id}
                  className="plc-text-lg plc-font-semibold plc-text-gray-500 order-details-row "
                >
                  <td colSpan="2">
                    <div className="plc-p-2 plc-overflow-auto sm:plc-p-4 plc-max-h-40 ">
                      <span className="">{item.quantity}× </span>
                      <span className="">
                        {item.product_sku_name}
                      </span>
                    </div>
                  </td>
                  <td>
                    {getFormattedPriceByLocal(
                      item.amount,
                      order.currency,
                      site.default_locale
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </>
    );
  });

  return (
    <table className="plc-w-full plc-py-4 plc-table-fixed ">
      <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
        <tr>
          <th className="plc-w-4/12 plc-pl-2">Total</th>
          <th className="plc-w-5/12 ">Date</th>
          <th className="plc-w-3/12">Details</th>
        </tr>
      </thead>
      {/* Spacer */}
      <tbody>
        <tr className="plc-h-4"></tr>
      </tbody>
      {orders}
      <tbody>
        <tr className="plc-h-4"></tr>
      </tbody>
    </table>
  );
};
