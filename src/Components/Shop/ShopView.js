import React from "react";
import { useTranslation } from "react-i18next";
import {
  ShopContainer,
  ShopSelectProductButton
} from "../../components";

export const ShopView = props => {
  const { t } = useTranslation("shop");

  return (
    <ShopContainer>
      <div id="products">
        <div className="pelcro-prefix-product-field">
          {props.products.map(product => {
            return (
              <div
                key={`product-${product.id}`}
                className="pelcro-prefix-product-container"
              >
                {product.image && (
                  <img
                    className="pelcro-prefix-shop-product-img"
                    alt="product"
                    src={product.image}
                  />
                )}
                <div className="pelcro-prefix-product-text-block">
                  <div className="pelcro-prefix-shop-product-name">
                    {product.name}
                  </div>
                  <div className="pelcro-prefix-shop-product-description">
                    {product.description}
                  </div>
                  <ShopSelectProductButton
                    product={product}
                    className="pelcro-prefix-change-text pelcro-prefix-btn"
                  >
                    {t("buttons.select")}
                  </ShopSelectProductButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ShopContainer>
  );
};
