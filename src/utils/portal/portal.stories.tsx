import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useState } from "react";
import { Portal } from "src/utils/portal/portal.tsx";
import { PortalPresenter } from "src/utils/portal/portal_presenter.ts";

export default {
  title: "utils/Portal",
  component: Portal,
};

export function Basic() {
  const [presenter] = useState(() => {
    return new PortalPresenter();
  });

  const isOpen = useAsyncValue(presenter.portalElementBroadcast) != null;

  function toggle() {
    if (isOpen) {
      presenter.close();
    } else {
      presenter.open();
    }
  }

  return (
    <div>
      <Portal presenter={presenter}>
        <div
          style={{
            display: "grid",
            placeItems: "center center",
            height: "100%",
            width: "100%",
            pointerEvents: "none"
          }}
        >
          <div
            style={{
              display: "grid",
              placeItems: "center center",
              width: "200px",
              height: "100px",
              backgroundColor: "#999",
              border: "2px solid black",
              pointerEvents: "auto"
            }}
          >
            Portal
          </div>
        </div>
      </Portal>
      <button onClick={toggle}>{isOpen ? "Close" : "Open"}</button>
    </div>
  );
}
