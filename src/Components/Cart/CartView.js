import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CartContainer } from "./CartContainer";
import { CartRemoveItemButton } from "./CartRemoveItemButton";
import { CartSubmit } from "./CartSubmit";
import { Badge } from "../../SubComponents/Badge";
import { calcAndFormatItemsTotal } from "../../utils/utils";
import { usePelcro } from "../../hooks/usePelcro";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { CartTotalPrice } from "./CartTotalPrice";
import { cartOpened, cartItemRemoved, cartClosed } from "../../utils/events";

export const CartView = (props) => {
  const { cartItems } = usePelcro();

  const { t } = useTranslation("cart");

  useEffect(() => {
    document.dispatchEvent(cartOpened(cartItems));
  }, []);

  return (
    <div id="pelcro-cart-view ">
      {cartItems.length ? (
        <form
          action="javascript:void(0);"
          className="plc-mt-4 pelcro-form plc-text-gray-900"
        >
          <CartContainer {...props}>
            <AlertWithContext />
            <div className="pelcro-cart-wrapper plc-mt-4">
              <div className="plc-flow-root">
                <ul role="list" className="plc--my-6 plc-divide-y plc-divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id}
                      id={`pelcro-cart-product-${item.id}`} className="plc-flex plc-py-6">
                      <div className="plc-size-20 plc-shrink-0 plc-overflow-hidden plc-rounded-md plc-border plc-border-gray-200">
                        <img alt={`image of ${item.name}`} src={item.image} className="size-full object-cover pelcro-cart-product-image
                         " />
                      </div>

                      <div className="plc-ml-4 plc-flex plc-flex-1 plc-flex-col">
                        <div>
                          <div className="plc-flex plc-justify-between plc-text-base plc-font-medium plc-text-gray-900">
                            <h3>
                              <a href={item.href}>{item.name}</a>
                            </h3>
                            <p className="plc-ml-4"> {calcAndFormatItemsTotal([item], item.currency)}</p>
                          </div>
                        </div>
                        <div className="plc-flex plc-flex-1 plc-items-end plc-justify-between plc-text-sm">
                          <p className="plc-text-gray-500">Qty {item.quantity}</p>
                          <div className="plc-flex">
                            <CartRemoveItemButton
                              itemId={item.id}
                              id={`pelcro-remove-product-${item.id}`}
                              aria-label="remove item from cart"
                              onClick={() =>
                                document.dispatchEvent(cartItemRemoved(item))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="plc-mt-4">
                <div className="plc-border-t plc-border-gray-200 plc-pt-6 plc-sm:px-6">
                  <div className="plc-flex plc-justify-between plc-text-base plc-font-medium plc-text-gray-900">
                    <CartTotalPrice />
                  </div>
                  <div className="plc-mt-4">
                    <CartSubmit
                      role="submit"
                      className="plc-w-full plc-mt-2"
                      id="pelcro-submit"
                      name={t("confirm")}
                      autoFocus={true}
                    />
                  </div>
                  <div className="plc-mt-6 plc-flex plc-justify-center plc-text-center plc-text-sm plc-text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        onClick={() =>
                          document.dispatchEvent(cartClosed())
                        }
                        className="plc-font-medium plc-text-gray-600 plc-hover:text-gray-700"
                      >
                        {t("continueShopping")}
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CartContainer>
        </form>
      ) : (
        <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-py-8 plc-px-4">
          <svg className="plc-w-16 plc-h-16 plc-text-gray-400 plc-mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <p className="plc-text-xl plc-font-medium plc-text-gray-900 plc-mb-2 pelcro-cart-empty">
            {t("empty")}
          </p>
        </div>
      )
      }
    </div >
  );
};
