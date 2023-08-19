import { useState } from "react";
import { Button } from "src/components/controls/buttons/button.tsx";
import { ClickAwayListener } from "src/components/utils/click_away_listener/click_away_listener.tsx";
import { Portal } from "src/components/utils/portal/portal.tsx";
import { PortalPresenter } from "src/components/utils/portal/portal_presenter.ts";

export default {
  title: "utils/ClickAwayListener",
  component: ClickAwayListener,
};

export function Click() {
  const [portalPresenter] = useState(() => {
    return new PortalPresenter();
  });

  function show() {
    portalPresenter.open();
  }

  function close() {
    portalPresenter.close();
  }

  return (
    <div>
      <Button onClick={show}>Show</Button>
      <Portal presenter={portalPresenter}>
        <div
          style={{
            display: "grid",
            placeItems: "center center",
            height: "100%",
            width: "100%",
          }}
        >
          <ClickAwayListener onClickAway={close}>
            <div
              style={{
                display: "grid",
                placeItems: "center center",
                width: "200px",
                height: "100px",
                backgroundColor: "#999",
                border: "2px solid black",
              }}
            >
              Click Outside to Close
            </div>
          </ClickAwayListener>
        </div>
      </Portal>
    </div>
  );
}

export function MouseDown() {
  const [portalPresenter] = useState(() => {
    return new PortalPresenter();
  });

  function show() {
    portalPresenter.open();
  }

  function close() {
    portalPresenter.close();
  }

  return (
    <div>
      <Button onClick={show}>Show</Button>
      <Portal presenter={portalPresenter}>
        <div
          style={{
            display: "grid",
            placeItems: "center center",
            height: "100%",
            width: "100%",
          }}
        >
          <ClickAwayListener mouseEvent="onMouseDown" onClickAway={close}>
            <div
              style={{
                display: "grid",
                placeItems: "center center",
                width: "200px",
                height: "100px",
                backgroundColor: "#999",
                border: "2px solid black",
              }}
            >
              MouseDown Outside to Close
            </div>
          </ClickAwayListener>
        </div>
      </Portal>
    </div>
  );
}

export function MouseUp() {
  const [portalPresenter] = useState(() => {
    return new PortalPresenter();
  });

  function show() {
    portalPresenter.open();
  }

  function close() {
    portalPresenter.close();
  }

  return (
    <div>
      <Button onClick={show}>Show</Button>
      <Portal presenter={portalPresenter}>
        <div
          style={{
            display: "grid",
            placeItems: "center center",
            height: "100%",
            width: "100%",
          }}
        >
          <ClickAwayListener mouseEvent="onMouseUp" onClickAway={close}>
            <div
              style={{
                display: "grid",
                placeItems: "center center",
                width: "200px",
                height: "100px",
                backgroundColor: "#999",
                border: "2px solid black",
              }}
            >
              MouseUp Outside to Close
            </div>
          </ClickAwayListener>
        </div>
      </Portal>
    </div>
  );
}
