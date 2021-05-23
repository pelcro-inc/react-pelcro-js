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

  // temp solution until the ecom refactor
  const products = window.Pelcro.ecommerce.products
    .read()
    .flatMap((prod) => prod.skus.map((sku) => sku));

  return (
    <div id="pelcro-cart-view">
      <div className="plc-mb-6 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4>{t("title")}</h4>
      </div>
      {isEmpty ? (
        <p className="plc-mt-4 plc-text-center pelcro-cart-empty">
          {t("empty")}
        </p>
      ) : (
        <form
          action="javascript:void(0);"
          className="plc-mt-2 pelcro-form"
        >
          <CartContainer {...props}>
            <div className="pelcro-cart-wrapper">
              {products.map((product) => {
                if (product.quantity > 0) {
                  return (
                    <div
                      key={product.id}
                      id={`pelcro-cart-product-${product.id}`}
                      className="plc-flex plc-items-center plc-pt-2 plc-mt-2 plc-border-t plc-border-gray-400 plc-min-h-12 plc-justify-evenly pelcro-cart-product-wrapper"
                    >
                      <div className="plc-w-1/4 pelcro-cart-image-wrapper">
                        {product.image && (
                          <Badge content={product.quantity}>
                            <img
                              className="plc-w-20 plc-h-20 pelcro-cart-product-image"
                              alt={`image of ${product.name}`}
                              src={product.image}
                            />
                          </Badge>
                        )}
                      </div>
                      <div className="plc-w-2/5 plc-break-words pelcro-cart-product-name">
                        {product.name}
                      </div>
                      <div className="plc-w-1/5 plc-text-center pelcro-cart-product-price">
                        {parseFloat(
                          (product.price / 100) * product.quantity
                        ).toLocaleString("fr-CA", {
                          style: "currency",
                          currency: "CAD"
                        })}
                      </div>
                      <CartRemoveProductButton
                        id={`pelcro-remove-product-${product.id}`}
                        className="plc-bg-red-400 hover:plc-bg-red-600"
                        data-key={product.id}
                        aria-label="remove item from cart"
                        icon={
                          <RemoveIcon
                            fill="white"
                            aria-hidden="true"
                            focusable="false"
                          />
                        }
                      />
                    </div>
                  );
                }
              })}
            </div>
            <div className="plc-flex plc-items-center plc-justify-end plc-pt-2 plc-mt-2 plc-font-bold plc-border-t plc-border-gray-400 pelcro-cart-total-wrapper">
              <p className="plc-mr-1 pelcro-cart-total-text">
                {t("total")}:
              </p>
              <p className="pelcro-cart-total">
                <CartTotalPrice />
              </p>
            </div>
            <CartSubmit
              role="submit"
              className="plc-w-full plc-mt-2"
              id="pelcro-submit"
              name={t("confirm")}
              autoFocus={true}
            />
          </CartContainer>
        </form>
      )}
    </div>
  );
};
