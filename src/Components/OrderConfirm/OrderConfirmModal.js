import React, { Component } from "react";
import PropTypes from "prop-types";
import Authorship from "../common/Authorship";
import { withTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMarkOutlineIcon } from "../../assets/check-outline.svg";
import { Badge } from "../../SubComponents/Badge";

export class OrderConfirmModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: this.props.products
    };

    this.plan = this.props.plan;
    this.product = this.props.product;

    this.locale = this.props.t;
    this.site = window.Pelcro.site.read();
  }

  componentWillUnmount = () => {
    this.removeAll();
  };

  handleSubmit = (e) => {
    if (e.key === "Enter") this.props.onClose();
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
        ((product.price / 100) * product.quantity).toFixed(2)
      );
    }
    return parseFloat(total).toLocaleString("fr-CA", {
      style: "currency",
      currency: "CAD"
    });
  };

  render() {
    return (
      <Modal
        id="pelcro-order-confirm-modal"
        className="border-t-8 border-green-500 "
      >
        <ModalBody>
          <div id="pelcro-order-confirm-view">
            <div className="flex flex-col items-center">
              <CheckMarkOutlineIcon className="w-32 my-4 text-green-500" />
              <div className="text-center text-gray-700">
                <h4 className="mb-4 text-3xl text-green-500">
                  {this.locale("messages.orderConfirmed.title")}
                </h4>
                <p>{this.locale("messages.orderConfirmed.body")}</p>
                <p>{this.locale("messages.haveQuestions")}</p>
              </div>
            </div>
            <div className="mt-5 pelcro-order-summary-container">
              <div className="pelcro-order-summary">
                <p className="font-bold pelcro-order-summary-title">
                  Order summary
                </p>
                {this.state.products.map((product) => {
                  return (
                    product.quantity > 0 && (
                      <div
                        key={product.id}
                        id={`pelcro-summary-product-${product.id}`}
                        className="flex items-center pt-2 mt-2 border-t border-gray-400 min-h-12 justify-evenly pelcro-summary-product-wrapper"
                      >
                        <div className="w-1/4 pelcro-summary-image-wrapper">
                          {product.image && (
                            <Badge content={product.quantity}>
                              <img
                                className="object-contain h-20 pelcro-summary-product-image"
                                alt={`image of ${product.name}`}
                                src={product.image}
                              />
                            </Badge>
                          )}
                        </div>
                        <div className="w-1/2 break-words pelcro-summary-product-name">
                          {product.name}
                        </div>
                        <div className="w-1/5 text-center pelcro-summary-product-price">
                          {parseFloat(
                            (product.price / 100) * product.quantity
                          ).toLocaleString("fr-CA", {
                            style: "currency",
                            currency: "CAD"
                          })}
                        </div>
                      </div>
                    )
                  );
                })}

                <div className="flex items-center justify-end pt-2 mt-2 font-bold border-t border-gray-400 pelcro-summary-total-wrapper">
                  <p className="mr-1 pelcro-summary-total-text">
                    Total:{" "}
                  </p>
                  <p className="pelcro-summary-total">
                    {this.countTotal()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                id="pelcro-submit"
                onClick={this.props.onClose}
                variant="outline"
                autoFocus
              >
                {this.locale("buttons.continue")}
              </Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Authorship />
        </ModalFooter>
      </Modal>
    );
  }
}

OrderConfirmModal.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  onClose: PropTypes.func
};

export const OrderConfirmModalWithTrans = withTranslation("shop")(
  OrderConfirmModal
);
