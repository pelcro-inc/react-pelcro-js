// Address view.
// Address form which is displayed after the Payment view if the plan requires user address.
// The user should fill all the fields to submit.

import React, { Component } from "react";
import ErrMessage from "../../common/ErrMessage";
import PropTypes from "prop-types";
import { getErrorMessages } from "../../common/Helpers";

import localisation from "../../../utils/localisation";
import { showError } from "../../../utils/showing-error";
import { sortCountries } from "../../../utils/utils";

import Header from "../../common/Header";
import Authorship from "../../common/Authorship";
import Submit from "../../common/Submit";

export function AddressCreateModal(props) {
//   constructor(props) {
//     super(props);

//     this.state = {
//       type: "shipping",
//       disableSubmit: false,
//       firstName: "",
//       lastName: "",
//       line1: "",
//       line2: "",
//       city: "",
//       state: "",
//       country: "",
//       postalCode: "",
//       allStates: [],
//       availableCountries: []
//     };

//     this.plan = this.props.plan;
//     this.product = this.props.product;

//     this.locale = localisation("address").getLocaleData();
//     this.site = window.Pelcro.site.read();
//     this.closeButton = window.Pelcro.paywall.displayCloseButton();

//     this.submitAddress = this.submitAddress.bind(this);
//   }

//   componentDidMount = () => {
//     window.Pelcro.insight.track("Modal Displayed", {
//       name: "address"
//     });
//     this.getCountryList();
//     this.getStateList();

//     document.addEventListener("keydown", this.handleSubmit);
//   };

//   componentWillUnmount = () => {
//     document.removeEventListener("keydown", this.handleSubmit);
//   };

//   handleSubmit = e => {
//     if (e.key === "Enter" && !this.state.disableSubmit) this.submitAddress();
//   };

//   setCountries = (error, tmp) => {
//     if (error) {
//       this.props.showError(error.message);
//     } else if (tmp) this.setState({ countries: sortCountries(tmp.countries) });
//   };

//   setStates = (error, tmp) => {
//     if (error) {
//       this.props.showError(error.message);
//     } else if (tmp) {
//       const tmpState = this.state.allStates;
//       tmpState.push(tmp);

//       const tmpCountry = this.state.availableCountries;
//       tmpCountry.push(tmp.selected_country);

//       this.setState({ allStates: tmpState });
//       this.setState({ availableCountries: tmpCountry });
//     }
//   };

//   getCountryList = () => {
//     window.Pelcro.geolocation.getCountryList(this.setCountries);
//   };

//   getStateList = () => {
//     window.Pelcro.geolocation.getStateList(this.setStates);
//   };

  createStateItems = () => {
    const { allStates } = this.state;
    const items = [];

    for (const stateItem in allStates) {
      if (allStates[stateItem].selected_country === this.state.country) {
        if (Array.isArray(allStates[stateItem].states)) {
          for (const state in allStates[stateItem].states) {
            const tmp = allStates[stateItem].states[state];
            items.push(
              <option key={tmp.code} value={tmp.code}>
                {tmp.name}
              </option>
            );
          }
          return items;
        } else {
          for (const key in allStates[stateItem].states) {
            items.push(
              <option key={key} value={key}>
                {allStates[stateItem].states[key]}
              </option>
            );
          }
          return items;
        }
      }
    }
  };

  createCountryItems = () => {
    if (this.state.countries) {
      const { countries } = this.state;
      const items = [];

      countries.forEach(([abbr, country]) =>
        items.push(
          <option key={abbr} value={abbr}>
            {country}
          </option>
        )
      );

      return items;
    }
  };

  chooseInputForm = () => {
    if (this.state.availableCountries.includes(this.state.country)) {
      return (
        <select
          value={this.state.state}
          onChange={this.onStateChange}
          className="pelcro-prefix-select pelcro-prefix-form-control"
          autoComplete="state"
          id="pelcro-input-state"
        >
          <option>{this.locale.labels.region}</option>
          {this.createStateItems()}
        </select>
      );
    } else
      return (
        <input
          type="text"
          value={this.state.state}
          onChange={this.onStateChange}
          className="pelcro-prefix-select pelcro-prefix-form-control"
          autoComplete="country"
          id="pelcro-input-country"
          placeholder={this.locale.labels.region}
        />
      );
  };

  // inserting error message into modal window
//   showError = message => {
//     showError(message, "pelcro-error-address");
//   };

  submitAddress = () => {
    // disable the submit button to prevent repeated clicks
    this.setState({ disableSubmit: true });

    window.Pelcro.address.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        type: this.state.type,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        line1: this.state.line1,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        postal_code: this.state.postalCode
      },
      (err, res) => {
        if (err) {
          this.setState({ disableSubmit: false });
          return this.showError(getErrorMessages(err));
        }

        if (this.props.giftCode) {
          let addressId = null;

          if (window.Pelcro.user.read().addresses) {
            addressId = window.Pelcro.user.read().addresses[0].id;
          }

          window.Pelcro.subscription.redeemGift(
            {
              auth_token: window.Pelcro.user.read().auth_token,
              gift_code: this.props.giftCode,
              address_id: addressId
            },
            (err, res) => {
              this.setState({ disableSubmit: false });

              if (err) {
                return this.showError(getErrorMessages(err));
              }

              alert("You've subscription has been redeeemed.");
              return this.props.resetView();
            }
          );
        } else {
          this.setState({ disableSubmit: false });
          if (!this.props.product) this.props.setView("checkout");
          else this.props.setView("payment");
        }
      }
    );
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-address"
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
                <div className="pelcro-prefix-title-clock">
                  <h4>{this.locale.title}</h4>
                </div>

                <ErrMessage name="address" />

                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-row">
                    <div className="col-md-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-first_name"
                      >
                        {this.locale.labels.firstName} *
                      </label>
                      <input
                        value={this.state.firstName}
                        onChange={this.onFirstNameChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="first-name"
                        id="pelcro-input-first_name"
                        type="text"
                        placeholder={this.locale.labels.firstName}
                      ></input>
                    </div>
                    <div className="col-md-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-last_name"
                      >
                        {this.locale.labels.lastName} *
                      </label>
                      <input
                        value={this.state.lastName}
                        onChange={this.onLastNameChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="last-name"
                        id="pelcro-input-last_name"
                        type="text"
                        placeholder={this.locale.labels.lastName}
                      ></input>
                    </div>
                  </div>
                  <div className="pelcro-prefix-row">
                    <div className="col-md-12">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-line1"
                      >
                        {this.locale.labels.address} *
                      </label>
                      <input
                        value={this.state.line1}
                        onChange={this.onLine1Change}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="street-address"
                        id="pelcro-input-line1"
                        type="text"
                        placeholder={this.locale.labels.address}
                      ></input>
                    </div>
                  </div>
                  <div className="pelcro-prefix-row">
                    <div className="col-md-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-postal_code"
                      >
                        {this.locale.labels.code} *
                      </label>
                      <input
                        value={this.state.postalCode}
                        onChange={this.onPostalCodeChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="postal-code"
                        id="pelcro-input-postal_code"
                        type="text"
                        placeholder={this.locale.labels.code}
                      ></input>
                    </div>
                    <div className="col-md-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-city"
                      >
                        {this.locale.labels.city} *
                      </label>
                      <input
                        value={this.state.city}
                        onChange={this.onCityChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="address-level2"
                        id="pelcro-input-city"
                        type="text"
                        placeholder={this.locale.labels.city}
                      ></input>
                    </div>
                  </div>
                  <div className="pelcro-prefix-row">
                    <div className="col-md-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-country"
                      >
                        {this.locale.labels.country} *
                      </label>
                      <select
                        value={this.state.country}
                        onChange={this.onCountryChange}
                        className="pelcro-prefix-select pelcro-prefix-form-control"
                        autoComplete="country"
                        id="pelcro-input-country"
                      >
                        <option> {this.locale.labels.country} </option>
                        {this.createCountryItems()}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-region"
                      >
                        {this.locale.labels.region} *
                      </label>
                      {this.chooseInputForm()}
                    </div>
                  </div>
                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {this.locale.labels.required}
                  </small>
                  <Submit
                    onClick={this.submitAddress}
                    text={this.locale.buttons.submit}
                    id="address-submit"
                    disabled={this.state.disableSubmit}
                  ></Submit>
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

