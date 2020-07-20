import React from "react";
import PropTypes from "prop-types";
import localisation from "../../utils/localisation";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

export const CartModal = props => {
  //     this.locale = localisation("cart").getLocaleData();

  const removeProduct = e => {
    let productContainer = {};
    const id = e.target.dataset.key;
    const productArr = this.state.products.slice();
    for (const product of productArr) {
      if (product.id === id) {
        if (product.quantity === 1) {
          product.quantity -= 1;
          this.setState({ products: productArr });
          this.props.setProductsForCart(this.state.products);

          productContainer = document.getElementById(
            `pelcro-prefix-container-product-${product.id}`
          );
          if (productContainer)
            productContainer.classList.add(
              "pelcro-prefix-product-container-wrapper"
            );
        } else {
          product.quantity -= 1;

          this.setState({ products: productArr });
          this.props.setProductsForCart(this.state.products);
        }
      }
    }
  };

  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-cart"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
          role="document"
        >
          <div className="pelcro-prefix-modal-content">
            <Header
              closeButton={window.Pelcro.paywall.displayCloseButton()}
              resetView={props.setView("")}
              site={window.Pelcro.site.read()}
            ></Header>

            <div className="pelcro-prefix-modal-body">
              <div className="pelcro-prefix-title-block">
                <h4>{this.locale.title}</h4>
              </div>

              <div className="pelcro-prefix-cart-field">
                {props.products.map(product => {
                  if (product.quantity > 0) {
                    isEmpty = false;
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
                                product.sku[0].price *
                                  product.quantity
                              ).toLocaleString("fr-CA", {
                                style: "currency",
                                currency: "CAD"
                              })}{" "}
                            </div>
                            <div className="col-5">
                              <button
                                id={`cart-btn-for-${product.id}`}
                                data-key={product.id}
                                className="pelcro-prefix-link pelcro-prefix-remove cross-container"
                                onClick={removeProduct}
                              >
                                <div className="remove-icon">
                                  <svg
                                    version="1.1"
                                    viewBox="-5 -5 70 70"
                                  >
                                    <path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z" />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else
                    return <div key={`product-${product.id}`}> </div>;
                })}

                {isEmpty && <div> {this.locale.empty}</div>}
              </div>

              {!isEmpty && (
                <div className="pelcro-prefix-total-container row">
                  <div className="pelcro-prefix-total-block row col-md-12">
                    <div className="pelcro-prefix-total-text col-6">
                      {" "}
                      {this.locale.total}:{" "}
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
          </div>
        </div>
      </div>
    </div>
  );
};
