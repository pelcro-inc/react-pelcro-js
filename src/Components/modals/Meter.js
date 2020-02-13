// Meter view.
// Shows popup in the lower right if the user is not subsctibed to the site.
// It prompts the user to subscribe (go to Select view) or login (go to Login view).

import React, { Component } from "react";
import PropTypes from "prop-types";

import localisation from "../../utils/localisation";

class Meter extends Component {
  constructor(props) {
    super(props);

    this.plan =
      this.props.plan || window.Pelcro.paywall.getProduct().plans[0];
    this.product =
      this.props.product || window.Pelcro.paywall.getProduct();

    this.locale = localisation("meter").getLocaleData();
    this.visitsLeft = window.Pelcro.paywall.freeVisitsLeft();
    this.user = window.Pelcro.user.read();
    this.site = window.Pelcro.site.read();

    this.displayLoginView = this.displayLoginView.bind(this);
    this.displaySelectView = this.displaySelectView.bind(this);
  }

  displayLoginView = () => {
    this.props.setView("login");
  };

  displaySelectView = () => {
    this.props.setView("select");
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          id="pelcro-view-meter"
          className="col-sm-4 col-md-3"
          data-animation="from-bottom"
          data-autoshow="200"
        >
          <button
            type="button"
            className="pelcro-prefix-close"
            aria-label="Close"
            onClick={this.props.resetView}
          >
            <span>&times;</span>
          </button>
          <div>
            {this.site.logo.url && (
              <img
                alt="avatar"
                className="pelcro-prefix-site-logo pelcro-prefix-center"
                src={this.site.logo.url}
              ></img>
            )}
            <div>
              <h4>
                {this.plan && this.product.paywall.meter_title}:{" "}
                {this.visitsLeft}
              </h4>
              <p>
                {this.plan && this.product.paywall.meter_subtitle}{" "}
                <button
                  className="pelcro-prefix-link"
                  onClick={this.displaySelectView}
                >
                  {this.locale.messages.subscribeNow}
                </button>
                {!window.Pelcro.user.isAuthenticated() && (
                  <span>
                    {" " +
                      this.locale.messages.alreadyHaveAccount +
                      " "}
                    <button
                      className="pelcro-prefix-link"
                      onClick={this.displayLoginView}
                    >
                      {" "}
                      {this.locale.messages.loginHere}
                    </button>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Meter.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  resetView: PropTypes.func
};

export default Meter;
