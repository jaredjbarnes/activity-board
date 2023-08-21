import { ObservableValue } from "@m/hex/observable_value";
import "./portal_element.ts";

export class PortalPresenter {
  private static _platformElement: HTMLElement = document.createElement("div");
  private _portalElement = new ObservableValue<HTMLElement | null>(null);

  get portalElementBroadcast() {
    return this._portalElement.broadcast;
  }

  static setPlatform(element: HTMLElement) {
    const children: Element[] = [];
    const platform = PortalPresenter._platformElement;

    while (platform.children.length > 0) {
      const firstChild = platform.firstElementChild;

      if (firstChild != null) {
        children.push(firstChild);
        platform.removeChild(firstChild);
      }
    }

    children.forEach((c) => element.appendChild(c));

    PortalPresenter._applyPlatformStyles(element);
    PortalPresenter._platformElement = element;
  }

  static getPlatform() {
    return PortalPresenter._platformElement;
  }

  private static _applyPlatformStyles(element: HTMLElement) {
    element.style.position = "fixed";
    element.style.top = "0px";
    element.style.left = "0px";
    element.style.bottom = "0px";
    element.style.right = "0px";
    element.style.overflow = "hidden";
    element.style.padding = "0px";
    element.style.margin = "0px";
    element.style.backgroundColor = "rgba(0,0,0,0)";
    element.style.pointerEvents = "none";
    element.style.transform = "translate3d(0,0,0)";
    element.style.zIndex = "1";
  }

  open() {
    const currentPortalElement = this._portalElement.getValue();

    if (currentPortalElement != null){
      return;
    }

    const portalElement = document.createElement("platform-portal");
    PortalPresenter._platformElement.appendChild(portalElement);
    return this._portalElement.setValue(portalElement);
  }

  close(): void {
    const portalElement = this._portalElement.getValue();

    if (portalElement != null) {
      PortalPresenter._platformElement.removeChild(portalElement);
      this._portalElement.setValue(null);
    }
  }
}

const defaultPlatformElement = PortalPresenter.getPlatform();
document.body.appendChild(defaultPlatformElement);
PortalPresenter.setPlatform(defaultPlatformElement);
