import React from "react";
import { ShopSelectProductButton } from "./ShopSelectProductButton";

export const ShopView = () => {
  const skus = window.Pelcro.ecommerce.products.getSkus();

  return (
    <div id="pelcro-shop-view">
      <div className="plc-grid plc-justify-center plc-rounded plc-justify-items-center plc-gap-y-5 plc-gap-x-3 pelcro-shop-products">
        {skus.map((item) => {
          return (
            <div
              key={item.id}
              className="plc-flex plc-flex-col plc-items-center plc-p-2 plc-m-3 plc-border plc-border-gray-400 plc-border-solid plc-rounded-md plc-w-max pelcro-shop-product-wrapper"
            >
              {item.image && (
                <img
                  className="pelcro-shop-product-image"
                  alt={`image of ${item.name}`}
                  src={item.image}
                />
              )}
              <div className="plc-flex plc-flex-col plc-items-center plc-mt-auto pelcro-shop-product-info-wrapper">
                <p className="plc-font-bold pelcro-shop-product-name">
                  {item.name}
                </p>
                <p className="plc-font-bold pelcro-shop-product-description">
                  {item.description}
                </p>
                <ShopSelectProductButton
                  itemId={item.id}
                  className="plc-mt-2"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

ShopView.viewId = "shop";
