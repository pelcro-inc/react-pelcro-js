import React, { Component } from "react";
import PropTypes from "prop-types";
import localisation from "../../utils/localisation";

import Header from "../common/Header";
import Authorship from "../common/Authorship";
import Submit from "../common/Submit";

class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: this.props.products
    };

    this.plan = this.props.plan;
    this.product = this.props.product;

    this.locale = localisation("confirm").getLocaleData();
    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();
  }

  componentDidMount = () => {
    const checkmark = document.getElementById("checkmark");
    checkmark.classList.add("wrapper-ready");
  };

  componentWillUnmount = () => {
    this.removeAll();
  };

  handleSubmit = e => {
    if (e.key === "Enter") this.props.resetView();
  };

  removeAll = () => {
    const productArr = this.state.products.slice();
    for (const product of productArr) {
      product.quantity = 0;
    }
    this.setState({ products: productArr });
    this.props.setProductsForCart(this.state.products);
  };

  countTotal = () => {
    const productArr = this.state.products.slice();
    let total = 0;
    for (const product of productArr) {
      total += parseFloat(
        (product.sku[0].price * product.quantity).toFixed(2)
      );
    }
    return parseFloat(total).toLocaleString("fr-CA", {
      style: "currency",
      currency: "CAD"
    });
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-confirm"
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
                closeButton={this.closeButton}
                resetView={this.props.resetView}
                site={this.site}
              ></Header>
              <div className="pelcro-prefix-modal-body">
                <div id="checkmark" className="wrapper">
                  <div className="spinner"> </div>
                  <div className="mask"> </div>
                  <div className="filler"> </div>
                  <div className="innerCircle"> </div>
                  <div className="check"> </div>
                </div>

                <div className="pelcro-prefix-title-block">
                  <h4>Order confirmed!</h4>
                  <p>
                    Your order has been confirmed and will be shipped
                    within the next few days. You'll shortly receive
                    an email confirmation of this order.
                  </p>
                  <p>
                    If you have any queries please don't hestigate to
                    contact us!
                  </p>
                </div>

                <Submit
                  onClick={this.props.resetView}
                  text={this.locale.buttons.continue}
                ></Submit>

                <div className="pelcro-prefix-cart-field">
                  <div className="order-summary">
                    <div className="order-summary-title">
                      {" "}
                      <p> Order summary </p>
                    </div>
                    {this.state.products.map(product => {
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
                              <div className="pelcro-prefix-product-row col-6 col-md-4">
                                <div className="pelcro-prefix-cart-product-price pelcro-prefix-price">
                                  {" "}
                                  {parseFloat(
                                    product.sku[0].price *
                                      product.quantity
                                  ).toLocaleString("fr-CA", {
                                    style: "currency",
                                    currency: "CAD"
                                  })}{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else
                        return (
                          <div key={`product-${product.id}`}> </div>
                        );
                    })}

                    <div className="pelcro-prefix-total-container row">
                      <div className="pelcro-prefix-total-block row col-md-12">
                        <div className="pelcro-prefix-total-text col-6">
                          {" "}
                          Total:{" "}
                        </div>
                        <div className="pelcro-prefix-total-price col-6">
                          {" "}
                          {this.countTotal()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pelcro-prefix-modal-footer">
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Confirm.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  resetView: PropTypes.func
};

export default Confirm;
