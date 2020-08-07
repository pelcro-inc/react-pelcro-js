import React from "react";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";
import {
  CartContainer,
  CartRemoveProductButton,
  CartSubmit,
  CartTotalPrice
} from "../../components";

export const CartView = (props) => {
  const { t } = useTranslation("cart");
  let isEmpty = !props.products.filter((product) => product.quantity)
    .length;
  return (
    <CartContainer {...props}>
      <div className="pelcro-prefix-modal-body">
        <div className="pelcro-prefix-title-block">
          <h4>{t("title")}</h4>
        </div>

        <div className="pelcro-prefix-cart-field">
          {props.products.map((product) => {
            if (product.quantity > 0) {
              return (
                <div key={`product-${product.id}`}>
                  <div
                    id={`pelcro-prefix-container-product-${product.id}`}
                    className="pelcro-prefix-product-container row"
                  >
                    <div className="pelcro-prefix-product-name-row col-6 row pelcro-prefix-name">
                      <div className="pelcro-prefix-img-wrapper">
                        {product.image && (
                          <div>
                            <img
                              className="pelcro-prefix-cart-product-img"
                              alt="product"
                              src={product.image}
                            />
                          </div>
                        )}
                        <div className="pelcro-prefix-cart-product-quantity pelcro-prefix-quantity">
                          {product.quantity}
                        </div>
                      </div>
                      <div className="pelcro-prefix-cart-product-name">
                        {product.name}
                      </div>
                    </div>
                    <div className="pelcro-prefix-product-row col-6 col-md-4 row">
                      <div className="col-7 pelcro-prefix-cart-product-price pelcro-prefix-price">
                        {" "}
                        {parseFloat(
                          (product?.price / 100) * product.quantity
                        ).toLocaleString("fr-CA", {
                          style: "currency",
                          currency: "CAD"
                        })}{" "}
                      </div>
                      <div className="col-5">
                        <CartRemoveProductButton product={product}>
                          <div className="remove-icon">
                            <svg version="1.1" viewBox="-5 -5 70 70">
                              <path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z" />
                            </svg>
                          </div>
                        </CartRemoveProductButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else return <div key={`product-${product.id}`}> </div>;
          })}

          {isEmpty && <div> {t("empty")}</div>}
        </div>

        {!isEmpty && (
          <div className="pelcro-prefix-total-container row">
            <div className="pelcro-prefix-total-block row col-md-12">
              <div className="pelcro-prefix-total-text col-6">
                {" "}
                {t("total")}:{" "}
              </div>
              <div className="pelcro-prefix-total-price col-6">
                {" "}
                <CartTotalPrice />
              </div>
            </div>
            <CartSubmit />
          </div>
        )}
      </div>
      <div className="pelcro-prefix-modal-footer">
        <Authorship></Authorship>
      </div>
    </CartContainer>
  );
};
