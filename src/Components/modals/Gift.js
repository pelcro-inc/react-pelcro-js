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

class Gift extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false,
      firstName: "",
      lastName: "",
      email: ""
    };

    this.locale = localisation("register").getLocaleData();

    this.plan = this.props.plan;
    this.product = this.props.product;
    this.site = this.props.site;

    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    this.gift = this.gift.bind(this);
    this.displayLoginView = this.displayLoginView.bind(this);
    this.displaySelectView = this.displaySelectView.bind(this);

    // States change
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleSubmit);

    this.props.ReactGA.event({
      category: "VIEWS",
      action: "Gift Modal Viewed",
      nonInteraction: true
    });
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter" && !this.state.disableSubmit) this.gift();
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-gift");
  };

  gift = () => {
    if (!this.state.email)
      return this.showError(this.locale.gift.messages.enterEmail);

    this.props.setGiftRecipient({
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    });

    if (
      this.props.product.address_required ||
      this.props.site.taxes_enabled
    )
      return this.props.setView("address");
    else this.props.setView("payment");
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  displaySelectView = () => {
    this.props.setView("select");
  };

  onFirstNameChange(event) {
    this.setState({ firstName: event.target.value });
  }

  onLastNameChange(event) {
    this.setState({ lastName: event.target.value });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-gift"
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
                  <h4>{this.locale.gift.titles.firstTitle}</h4>
                  <p>{this.locale.gift.titles.secondTitle}</p>
                </div>

                <ErrMessage name="gift" />

                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-row">
                    <div className="col-sm-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-first_name"
                      >
                        {this.locale.gift.labels.firstName}
                      </label>
                      <input
                        value={this.state.first_name}
                        onChange={this.onFirstNameChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="first-name"
                        id="pelcro-input-first_name"
                        type="text"
                        placeholder={
                          this.locale.gift.labels.firstNamePlaceholder
                        }
                      ></input>
                    </div>
                    <div className="col-sm-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-last_name"
                      >
                        {this.locale.gift.labels.lastName}
                      </label>
                      <input
                        value={this.state.last_name}
                        onChange={this.onLastNameChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="last-name"
                        id="pelcro-input-last_name"
                        type="text"
                        placeholder={
                          this.locale.gift.labels.lastNamePlaceholder
                        }
                      ></input>
                    </div>
                  </div>
                  <div className="pelcro-prefix-row">
                    <div className="col-sm-12">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-email"
                      >
                        {this.locale.gift.labels.email} *
                      </label>
                      <input
                        value={this.state.email}
                        onChange={this.onEmailChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        id="pelcro-input-email"
                        type="email"
                        placeholder={
                          this.locale.gift.labels.emailPlaceholder
                        }
                      ></input>
                    </div>
                  </div>

                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {this.locale.gift.labels.required}
                  </small>

                  <Submit
                    onClick={this.gift}
                    text={this.locale.gift.buttons.gift}
                    disabled={this.state.disableSubmit}
                  ></Submit>

                  <p className="pelcro-prefix-small-text">
                    {this.locale.messages.iAgree.iAgree + " "}
                    <a
                      className="pelcro-prefix-link pelcro-prefix-terms-link"
                      target="new"
                      href="https://www.pelcro.com/terms"
                    >
                      {this.locale.messages.iAgree.terms}
                    </a>{" "}
                    {this.locale.messages.iAgree.and}{" "}
                    <a
                      className="pelcro-prefix-link pelcro-prefix-terms-link"
                      target="new"
                      href="https://www.pelcro.com/privacy"
                    >
                      {this.locale.messages.iAgree.privacy}
                    </a>
                  </p>
                </div>
              </div>
              <div className="pelcro-prefix-modal-footer">
                <small>
                  {" " + this.locale.messages.selectPlan}
                  <button
                    className="pelcro-prefix-link"
                    onClick={this.displaySelectView}
                  >
                    {this.locale.messages.here}
                  </button>
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

Gift.propTypes = {
  site: PropTypes.object,
  plan: PropTypes.object,
  product: PropTypes.object,
  setView: PropTypes.func,
  resetView: PropTypes.func,
  setGiftRecipient: PropTypes.func
};

export default Gift;
