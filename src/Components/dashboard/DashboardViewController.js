import React from "react";
import { usePelcro } from "../../hooks/usePelcro";

export const DashboardViewController = ({
  rootId = "pelcro-dashboard-view",
  children
}) => {
  const { dashboardView } = usePelcro();

  return (
    <div id={rootId} className="pelcro-dashboard-view">
      {/* Conditionally render dashboard views */}
      {React.Children.map(children, (child) => child).find(
        ({ type }) => type?.viewId === dashboardView
      )}
    </div>
  );
};
