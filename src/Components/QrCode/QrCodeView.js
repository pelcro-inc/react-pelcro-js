import React from "react";
import QRCode from "react-qr-code";

export function QrCodeView() {
  const value = window.Pelcro.user.read().id
    ? `${window.Pelcro.environment.domain}/admin/${
        window.Pelcro.siteid
      }/customers/${window.Pelcro.user.read().id}`
    : `${window.Pelcro.environment.domain}/admin/${window.Pelcro.siteid}/customers`;

  return (
    <div id="pelcro-qrcode-view">
      <div className="plc-my-4">
        <QRCode style={{ margin: "auto" }} value={value} />
      </div>
    </div>
  );
}
