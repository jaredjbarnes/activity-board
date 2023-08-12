import { useAsyncValue } from "@m/hex/hooks/use_async_value"
import { createPortal } from "react-dom";
import { PortalPresenter } from "src/utils/portal/portal_presenter.ts"

export interface PortalProps {
  presenter: PortalPresenter;
  children: React.ReactNode;
}

export function Portal({children, presenter}: PortalProps){
  const portalElement = useAsyncValue(presenter.portalElementBroadcast);

  if (portalElement == null){
    return null;
  }

  return createPortal(children, portalElement);
}