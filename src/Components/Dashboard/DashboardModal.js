import React, { useEffect } from "react";
import { Addresses } from "./Addresses";
import { Subscriptions } from "./Subscriptions";
import { Logout } from "../../SubComponents/Logout";

export const DashboardModal = props => {
  const site = window.Pelcro.site.read();
  const user = window.Pelcro.user.read();

  useEffect(() => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "dashboard"
    });
    props.ReactGA.event({
      category: "VIEWS",
      action: "Dashboard Modal Viewed",
      nonInteraction: true
    });
  }, [props.ReactGA]);

  const onSubmitGiftCode = () => {
    return props.setView("redeem");
  };

  const displaySourceCreate = () => {
    return props.setView("source-create");
  };

  const displayUserEdit = () => {
    return props.setView("user-edit");
  };

  return (
    <div className="pelcro-prefix-view">
      <div id="pelcro-view-dashboard">
        <button
          type="button"
          className="pelcro-prefix-dashboard-close pelcro-prefix-close"
          aria-label="Close"
          onClick={props.onClose}
        >
          <span>&times;</span>
        </button>
        <div className="pelcro-prefix-dashboard-block logo">
          {site.logo && (
            <img
              alt="avatar"
              className="pelcro-prefix-site-logo pelcro-prefix-center"
              src={site.logo.url}
            />
          )}
        </div>

        <div className="dashboard-content">
          <div className="border-block">
            <div className="subscriptions-header border-text">
              <h4>Account</h4>
            </div>

            <div className="pelcro-prefix-dashboard-block">
              {(user.first_name || user.last_name) && (
                <div className="pelcro-prefix-dashboard-text row">
                  <span className="pelcro-prefix-dashboard-label col-4">
                    Name
                  </span>
                  <span className="pelcro-prefix-dashboard-value col-8">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              )}

              {user.email && (
                <div className="pelcro-prefix-dashboard-text row">
                  <span className="pelcro-prefix-dashboard-label col-4">
                    Email
                  </span>
                  <div className="pelcro-prefix-dashboard-value col-8">
                    <span className="dashboard-email">{user.email}</span>
                    <div className="pelcro-prefix-dashboard-link">
                      <button
                        className="pelcro-prefix-link"
                        type="button"
                        onClick={displayUserEdit}
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pelcro-prefix-dashboard-text row">
                <span className="pelcro-prefix-dashboard-label col-4">
                  Addresses
                </span>
                <span className="col-8">
                  <Addresses />
                </span>
              </div>

              {user.source && (
                <div className="pelcro-prefix-dashboard-text row">
                  <span className="pelcro-prefix-dashboard-label col-4">
                    Payment Method
                  </span>
                  <div className="pelcro-prefix-dashboard-value col-8">
                    <span className="dashboard-email">
                      {user.source.properties.last4} -{" "}
                      {user.source.properties.brand}
                    </span>
                    <div className="pelcro-prefix-dashboard-link">
                      <button
                        className="pelcro-prefix-link"
                        type="button"
                        onClick={displaySourceCreate}
                      >
                        Update Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-block">
            <div className="subscriptions-header border-text">
              <h4>Subscriptions</h4>
            </div>
            <div className="pelcro-prefix-dashboard-block">
              <Subscriptions />
              <div className="pelcro-prefix-dashboard-text">
                <div className="redeem-gift">
                  <button
                    className="pelcro-prefix-link"
                    type="button"
                    onClick={onSubmitGiftCode}
                  >
                    Redeem gift
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Logout ReactGA={props.ReactGA} />
        </div>
      </div>
    </div>
  );
};
