import React from "react";
import { useTranslation } from "react-i18next";
import { ShopContainer } from "./ShopContainer";
import { ShopSelectProductButton } from "./ShopSelectProductButton";

export const ShopView = (props) => {
  const { t } = useTranslation("shop");

  return (
    <div id="pelcro-shop-view">
      <ShopContainer {...props}>
        <div className="grid justify-center rounded justify-items-center gap-y-5 gap-x-3 pelcro-shop-products">
          {props.products.map((product) => {
            return (
              <div
                key={product.id}
                className="flex flex-col items-center p-2 m-3 border border-gray-400 border-solid rounded-md w-max pelcro-shop-product-wrapper"
              >
                {product.image && (
                  <img
                    className="pelcro-shop-product-image"
                    alt={`image of ${product.name}`}
                    src={product.image}
                  />
                )}
                <div className="flex flex-col items-center mt-auto pelcro-shop-product-info-wrapper">
                  <p className="font-bold pelcro-shop-product-name">
                    {product.name}
                  </p>
                  <p className="font-bold pelcro-shop-product-description">
                    {product.description}
                  </p>
                  <ShopSelectProductButton
                    product={product}
                    name={t("buttons.select")}
                    className="mt-2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ShopContainer>
    </div>
  );
};
