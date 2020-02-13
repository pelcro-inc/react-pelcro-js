// Register view.
// Sign up form. It is displayed after the plan is selected (after Select view) if user is not authenticated.

import React, { Component } from "react";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";

import localisation from "../../utils/localisation";
import { showError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";
import Submit from "../common/Submit";

class Redeem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false,
      giftCode: ""
    };

    this.locale = localisation("register").getLocaleData();

    this.site = this.props.site;

    this.closeButton = window.Pelcro.paywall.displayCloseButton();
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleSubmit);

    this.props.ReactGA.event({
      category: "VIEWS",
      action: "Redeem Gift Modal Viewed",
      nonInteraction: true
    });

    const tmpGiftCode = window.Pelcro.helpers.getURLParameter(
      "gift_code"
    )
      ? window.Pelcro.helpers.getURLParameter("gift_code")
      : "";
    this.setState({ giftCode: tmpGiftCode });
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter" && !this.state.disableSubmit) this.redeem();
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-redeem");
  };

  redeem = () => {
    if (!this.state.giftCode)
      return this.showError("Please enter a gift code.");

    this.props.setGiftCode(this.state.giftCode);

    this.setState({ disableSubmit: true });

    if (window.Pelcro.user.isAuthenticated()) {
      this.props.setView("address");
    } else this.props.setView("register");
  };

  onGiftCodeChange = event => {
    this.setState({ giftCode: event.target.value });
  };

  onAddAddress = () => {
    this.props.setView("address");
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-redeem"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered">
            <div
              className="pelcro-prefix-modal-content"
              role="document"
            >
              <Header
                closeButton={this.closeButton}
                resetView={this.props.resetView}
                site={this.site}
              ></Header>
              <div className="pelcro-prefix-modal-body">
                <div className="pelcro-prefix-title-block">
                  <h4>{this.locale.redeem.titles.firstTitle}</h4>
                  <p>{this.locale.redeem.titles.secondTitle}</p>
                </div>

                <ErrMessage name="redeem" />

                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-row">
                    <div className="col-sm-12">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-gift_code"
                      >
                        {this.locale.redeem.labels.code} *
                      </label>
                      <input
                        value={this.state.giftCode}
                        onChange={this.onGiftCodeChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        id="pelcro-input-gift_code"
                        placeholder={
                          this.locale.redeem.labels.codePlaceholder
                        }
                      ></input>
                    </div>
                  </div>

                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {this.locale.redeem.labels.required}
                  </small>

                  <Submit
                    onClick={this.redeem}
                    text={this.locale.redeem.buttons.redeem}
                    disabled={this.state.disableSubmit}
                  ></Submit>
                </div>
              </div>
              <div className="pelcro-prefix-modal-footer">
                <small>
                  {this.locale.redeem.footer.click}{" "}
                  <button
                    className="pelcro-prefix-link"
                    onClick={this.onAddAddress}
                  >
                    {this.locale.redeem.footer.here}
                  </button>{" "}
                  {this.locale.redeem.footer.toAdd}
                </small>
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Redeem.propTypes = {
  site: PropTypes.object,
  setView: PropTypes.func,
  resetView: PropTypes.func,
  setGiftCode: PropTypes.func
};

export default Redeem;
