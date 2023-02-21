import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { DashboardContainer } from "./DashboardContainer";
import { DashboardContent } from "./DashboardContent";

/**
 *
 */
export function Dashboard(props) {
  React.useEffect(() => {
    props.onDisplay?.();
  }, []);

  const { resetView } = usePelcro();

  return (
    <DashboardContainer {...props}>
      <DashboardContent
        onClose={() => {
          props.onClose?.();
          resetView();
        }}
        {...props}
      />
    </DashboardContainer>
  );
}

Dashboard.viewId = "dashboard";
