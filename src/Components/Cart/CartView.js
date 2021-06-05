import React from "react";
import { useTranslation } from "react-i18next";
import { CartContainer } from "./CartContainer";
import { CartRemoveItemButton } from "./CartRemoveItemButton";
import { CartSubmit } from "./CartSubmit";
import { Badge } from "../../SubComponents/Badge";
import { calcAndFormatItemsTotal } from "../../utils/utils";
import { usePelcro } from "../../hooks/usePelcro";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const CartView = (props) => {
  const { cartItems } = usePelcro();

  const { t } = useTranslation("cart");

  return (
    <div id="pelcro-cart-view">
      <div className="plc-mb-6 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4>{t("title")}</h4>
      </div>
      {cartItems.length ? (
        <form
          action="javascript:void(0);"
          className="plc-mt-2 pelcro-form"
        >
          <CartContainer {...props}>
            <AlertWithContext />
            <div className="pelcro-cart-wrapper">
              {cartItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    id={`pelcro-cart-product-${item.id}`}
                    className="plc-flex plc-items-center plc-pt-2 plc-mt-2 plc-border-t plc-border-gray-400 plc-min-h-12 plc-justify-evenly pelcro-cart-product-wrapper"
                  >
                    <div className="plc-w-1/4 pelcro-cart-image-wrapper">
                      {item.image && (
                        <Badge content={item.quantity}>
                          <img
                            className="plc-w-20 plc-h-20 pelcro-cart-product-image"
                            alt={`image of ${item.name}`}
                            src={item.image}
                          />
                        </Badge>
                      )}
                    </div>
                    <div className="plc-w-2/5 plc-break-words pelcro-cart-product-name">
                      {item.name}
                    </div>
                    <div className="plc-w-1/5 plc-text-center pelcro-cart-product-price">
                      {calcAndFormatItemsTotal([item])}
                    </div>
                    <CartRemoveItemButton
                      itemId={item.id}
                      id={`pelcro-remove-product-${item.id}`}
                      className="plc-bg-red-400 hover:plc-bg-red-600"
                      aria-label="remove item from cart"
                    />
                  </div>
                );
              })}
            </div>
            <div className="plc-flex plc-items-center plc-justify-end plc-pt-2 plc-mt-2 plc-font-bold plc-border-t plc-border-gray-400 pelcro-cart-total-wrapper">
              <p className="plc-mr-1 pelcro-cart-total-text">
                {t("total")}:
              </p>
              <p className="pelcro-cart-total">
                {calcAndFormatItemsTotal(cartItems)}
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
      ) : (
        <p className="plc-mt-4 plc-text-center pelcro-cart-empty">
          {t("empty")}
        </p>
      )}
    </div>
  );
};
