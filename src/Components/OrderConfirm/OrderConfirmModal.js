import React, { Component } from "react";
import Authorship from "../common/Authorship";
import { withTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMark } from "../../assets/check-solid.svg";
import { Badge } from "../../SubComponents/Badge";
import { calcAndFormatItemsTotal } from "../../utils/utils";

/**
 *
 */
export function OrderConfirmModalWithHook(props) {
  React.useEffect(() => {
    props.onDisplay?.();
  }, []);

  // temp solution until the ecom refactor
  const products = window.Pelcro.ecommerce.products
    .read()
    .flatMap((prod) => prod.skus.map((sku) => sku));

  const { order, switchView, resetView, set } = usePelcro();

  return (
    <OrderConfirmModalWithTrans
      products={products}
      order={order}
      onClose={() => {
        props.onClose?.();
        set({ order: null });
        resetView();
      }}
      setView={switchView}
    />
  );
}

OrderConfirmModalWithHook.viewId = "order-confirm";
export class OrderConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.locale = this.props.t;
  }

  componentDidMount = () => {
    this.props?.onDisplay?.();
  };

  componentWillUnmount = () => {
    this.props.resetCart();
  };

  handleSubmit = (e) => {
    if (e.key === "Enter") this.props.onClose();
  };

  render() {
    return (
      <Modal
        id="pelcro-order-confirm-modal"
        className="plc-border-t-8 plc-border-primary-500"
        onClose={this.props.onClose}
      >
        <ModalBody>
          <div id="pelcro-order-confirm-view">
            <div className="plc-flex plc-flex-col plc-items-center">
              <CheckMark className="plc-w-32 plc-my-4 plc-text-green-500" />
              <div className="plc-text-center plc-text-gray-900">
                <h4 className="plc-mb-4 plc-text-3xl">
                  {this.locale("messages.orderConfirmed.title")}
                </h4>
                <p>{this.locale("messages.orderConfirmed.body")}</p>
                <p>{this.locale("messages.haveQuestions")}</p>
              </div>
            </div>
            <div className="plc-mt-5 pelcro-order-summary-wrapper">
              <p className="plc-font-bold pelcro-order-summary-title">
                {this.locale("labels.summary")}
              </p>
              {this.props.orderedItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    id={`pelcro-summary-product-${item.id}`}
                    className="plc-flex plc-items-center plc-pt-2 plc-mt-2 plc-border-t plc-border-gray-400 plc-min-h-12 plc-justify-evenly pelcro-summary-product-wrapper"
                  >
                    <div className="plc-w-1/4 pelcro-summary-image-wrapper">
                      {item.image && (
                        <Badge content={item.quantity}>
                          <img
                            className="plc-object-contain plc-w-20 plc-h-20 pelcro-summary-product-image"
                            alt={`image of ${item.name}`}
                            src={item.image}
                          />
                        </Badge>
                      )}
                    </div>
                    <div className="plc-w-1/2 plc-break-words pelcro-summary-product-name">
                      {item.name}
                    </div>
                    <div className="plc-w-1/5 plc-text-center pelcro-summary-product-price">
                      {calcAndFormatItemsTotal([item])}
                    </div>
                  </div>
                );
              })}

              <div className="plc-flex plc-items-center plc-justify-end plc-pt-2 plc-mt-2 plc-font-bold plc-border-t plc-border-gray-400 pelcro-summary-total-wrapper">
                <p className="plc-mr-1 pelcro-summary-total-text">
                  {this.locale("labels.total")}
                </p>
                <p className="pelcro-summary-total">
                  {calcAndFormatItemsTotal(this.props.orderedItems)}
                </p>
              </div>
            </div>
            <div className="plc-flex plc-justify-center plc-mt-6">
              <Button
                id="pelcro-submit"
                onClick={this.props.onClose}
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

export const OrderConfirmModalWithTrans = withTranslation("shop")(
  OrderConfirmModal
);
