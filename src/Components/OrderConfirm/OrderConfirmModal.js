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

  componentDidMount = () => {
    this.props?.onDisplay?.();
  };

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
        className="plc-border-t-8 plc-border-primary-500"
        onClose={this.props.onClose}
        hideHeaderLogo={this.props.hideHeaderLogo}
      >
        <ModalBody>
          <div id="pelcro-order-confirm-view">
            <div className="plc-flex plc-flex-col plc-items-center">
              <CheckMarkOutlineIcon className="plc-w-32 plc-my-4 plc-text-primary-500" />
              <div className="plc-text-center plc-text-gray-700">
                <h4 className="plc-mb-4 plc-text-3xl plc-text-primary-500">
                  {this.locale("messages.orderConfirmed.title")}
                </h4>
                <p>{this.locale("messages.orderConfirmed.body")}</p>
                <p>{this.locale("messages.haveQuestions")}</p>
              </div>
            </div>
            <div className="plc-mt-5 pelcro-order-summary-wrapper">
              <p className="plc-font-bold pelcro-order-summary-title">
                Order summary
              </p>
              {this.state.products.map((product) => {
                return (
                  product.quantity > 0 && (
                    <div
                      key={product.id}
                      id={`pelcro-summary-product-${product.id}`}
                      className="plc-flex plc-items-center plc-pt-2 plc-mt-2 plc-border-t plc-border-gray-400 plc-min-h-12 plc-justify-evenly pelcro-summary-product-wrapper"
                    >
                      <div className="plc-w-1/4 pelcro-summary-image-wrapper">
                        {product.image && (
                          <Badge content={product.quantity}>
                            <img
                              className="plc-object-contain plc-w-20 plc-h-20 pelcro-summary-product-image"
                              alt={`image of ${product.name}`}
                              src={product.image}
                            />
                          </Badge>
                        )}
                      </div>
                      <div className="plc-w-1/2 plc-break-words pelcro-summary-product-name">
                        {product.name}
                      </div>
                      <div className="plc-w-1/5 plc-text-center pelcro-summary-product-price">
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

              <div className="plc-flex plc-items-center plc-justify-end plc-pt-2 plc-mt-2 plc-font-bold plc-border-t plc-border-gray-400 pelcro-summary-total-wrapper">
                <p className="plc-mr-1 pelcro-summary-total-text">
                  Total:{" "}
                </p>
                <p className="pelcro-summary-total">
                  {this.countTotal()}
                </p>
              </div>
            </div>
            <div className="plc-flex plc-justify-center plc-mt-6">
              <Button
                id="pelcro-submit"
                onClick={this.props.onClose}
                variant="outline"
                autoFocus={true}
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
