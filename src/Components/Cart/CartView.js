import React from "react";
import { useTranslation } from "react-i18next";
import { CartContainer } from "./CartContainer";
import { CartRemoveProductButton } from "./CartRemoveProductButton";
import { CartSubmit } from "./CartSubmit";
import { CartTotalPrice } from "./CartTotalPrice";
import { ReactComponent as RemoveIcon } from "../../assets/x-icon.svg";
import { Badge } from "../../SubComponents/Badge";

export const CartView = (props) => {
  const { t } = useTranslation("cart");
  const isEmpty =
    (window.Pelcro.cartProducts &&
      window.Pelcro.cartProducts.length === 0) ??
    true;

  return (
    <div id="pelcro-cart-view">
      <div className="flex flex-col items-center text-lg font-semibold text-center pelcro-title-wrapper">
        <h4>{t("title")}</h4>
      </div>
      {isEmpty ? (
        <p className="mt-4 text-center pelcro-cart-empty">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-2 pelcro-form">
          <CartContainer {...props}>
            <div className="pelcro-cart-wrapper">
              {props.products.map((product) => {
                if (product.quantity > 0) {
                  return (
                    <div
                      key={product.id}
                      id={`pelcro-cart-product-${product.id}`}
                      className="flex items-center pt-2 mt-2 border-t border-gray-400 min-h-12 justify-evenly pelcro-cart-product-wrapper"
                    >
                      <div className="w-1/4 pelcro-cart-image-wrapper">
                        {product.image && (
                          <Badge content={product.quantity}>
                            <img
                              className="w-20 h-20 pelcro-cart-product-image"
                              alt={`image of ${product.name}`}
                              src={product.image}
                            />
                          </Badge>
                        )}
                      </div>
                      <div className="w-2/5 break-words pelcro-cart-product-name">
                        {product.name}
                      </div>
                      <div className="w-1/5 text-center pelcro-cart-product-price">
                        {parseFloat(
                          (product.price / 100) * product.quantity
                        ).toLocaleString("fr-CA", {
                          style: "currency",
                          currency: "CAD"
                        })}
                      </div>
                      <CartRemoveProductButton
                        id={`pelcro-remove-product-${product.id}`}
                        className="bg-gray-800 hover:bg-gray-600"
                        data-key={product.id}
                        aria-label="remove item from cart"
                        icon={
                          <RemoveIcon
                            fill="white"
                            aria-hidden="true"
                            focusable="false"
                            className="pointer-events-none"
                          />
                        }
                      />
                    </div>
                  );
                }
              })}
            </div>
            <div className="flex items-center justify-end pt-2 mt-2 font-bold border-t border-gray-400 pelcro-cart-total-wrapper">
              <p className="mr-1 pelcro-cart-total-text">
                {t("total")}:
              </p>
              <p className="pelcro-cart-total">
                <CartTotalPrice />
              </p>
            </div>
            <CartSubmit
              className="mt-2"
              id="pelcro-submit"
              name={t("confirm")}
            />
          </CartContainer>
        </div>
      )}
    </div>
  );
};
