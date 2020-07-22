import React, { Component } from "react";
import PropTypes from "prop-types";

import localisation from "../../utils/localisation";

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: this.props.products
    };

    this.locale = localisation("products").getLocaleData();
  }

  selectProduct = e => {
    let productButton = {};
    const id = e.target.dataset.key;
    const productArr = this.state.products.slice();

    // Display added to cart message
    for (const product of productArr) {
      if (product.id === id) {
        product.quantity += 1;
        productButton = document.getElementById(
          `pelcro-prefix-btn-for-${product.id}`
        );
        productButton.disabled = true;
        productButton.textContent = this.locale.buttons.added;
      }
    }

    // Hide added to cart message after a delay
    setTimeout(() => {
      productButton.disabled = false;
      productButton.textContent = this.locale.buttons.select;
    }, 1000);

    this.setState({ products: productArr });
    this.props.setProducts(this.state.products);
  };

  render() {
    return (
      <div className="pelcro-prefix-product-field">
        {this.state.products.map(product => {
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
                <button
                  data-key={product.id}
                  id={`pelcro-prefix-btn-for-${product.id}`}
                  onClick={this.selectProduct}
                  className="pelcro-prefix-change-text pelcro-prefix-btn"
                >
                  {this.locale.buttons.select}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

Products.propTypes = {
  products: PropTypes.array,
  setProducts: PropTypes.func
};

export default Products;
