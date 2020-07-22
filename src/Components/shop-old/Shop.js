import React, { Component } from "react";
import Products from "./Products";

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: window.Pelcro.product.listGoods()
    };
  }

  componentDidMount = () => {
    this.props.setProductsForCart(this.state.products);
  };

  setProducts = products => {
    this.setState({ products });
    this.props.setProductsForCart(products);
  };

  render() {
    return (
      <div id="products">
        <Products
          products={this.state.products}
          setProducts={this.setProducts}
        />
      </div>
    );
  }
}

export default Shop;
