import React from "react";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";
import { CartContainer } from "./CartContainer";
import { CartRemoveProductButton } from "./CartRemoveProductButton";
import { CartSubmit } from "./CartSubmit";
import { CartTotalPrice } from "./CartTotalPrice";
import { ReactComponent as RemoveIcon } from "../../assets/x-icon.svg";

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
                        <CartRemoveProductButton
                          product={product}
                          className="pelcro-prefix-btn-dark remove-btn"
                        >
                          <RemoveIcon
                            fill="white"
                            className="remove-btn-icon"
                            aria-hidden="true"
                            focusable="false"
                          />
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
