import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CartContainer } from "./CartContainer";
import { CartRemoveItemButton } from "./CartRemoveItemButton";
import { CartSubmit } from "./CartSubmit";
import { Badge } from "../../SubComponents/Badge";
import {
  calcAndFormatItemsTotal,
  calcOrderAmount
} from "../../utils/utils";
import { usePelcro } from "../../hooks/usePelcro";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { CartTotalPrice } from "./CartTotalPrice";
import {
  cartOpened,
  cartItemRemoved,
  orderCheckedOut
} from "../../utils/events";

export const CartView = (props) => {
  const { cartItems } = usePelcro();

  const totalPriceCurrency = cartItems[0].currency;
  const user_id = window.Pelcro.user.read().id;

  const { t } = useTranslation("cart");

  useEffect(() => {
    document.dispatchEvent(cartOpened(cartItems));
  }, []);

  return (
    <div id="pelcro-cart-view">
      <div className="plc-mb-6 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4>{t("title")}</h4>
      </div>
      {cartItems.length ? (
        <form
          action="javascript:void(0);"
          className="plc-mt-2 pelcro-form plc-text-gray-900"
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
                      {calcAndFormatItemsTotal([item], item.currency)}
                    </div>
                    <CartRemoveItemButton
                      itemId={item.id}
                      id={`pelcro-remove-product-${item.id}`}
                      aria-label="remove item from cart"
                      onClick={() =>
                        document.dispatchEvent(cartItemRemoved(item))
                      }
                    />
                  </div>
                );
              })}
            </div>
            <div className="plc-flex plc-items-center plc-justify-end plc-pt-2 plc-mt-2 plc-font-bold plc-border-t plc-border-gray-400 pelcro-cart-total-wrapper">
              <CartTotalPrice />
            </div>
            <CartSubmit
              role="submit"
              className="plc-w-full plc-mt-2"
              id="pelcro-submit"
              name={t("confirm")}
              autoFocus={true}
              onClick={() =>
                document.dispatchEvent(
                  orderCheckedOut({
                    order: {
                      user_id,
                      currency: totalPriceCurrency,
                      amount: calcOrderAmount(cartItems),
                      items: cartItems
                    }
                  })
                )
              }
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
