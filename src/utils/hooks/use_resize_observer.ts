import { useLayoutEffect, useRef } from "react";

type ResizeHandler = (
  newWidth: number,
  newHeight: number,
  entry: ResizeObserverEntry
) => void;

interface Size {
  width: number;
  height: number;
}

export enum TriggerConfig {
  Both = 0,
  Width,
  Height,
}

class ResizeObserverRegistry {
  private _resizeObserver: ResizeObserver;
  private _elementHandlers: WeakMap<Element, ResizeHandler[]>;
  private _elementSizes: WeakMap<Element, Size>;
  private _elementTriggerConfig: WeakMap<Element, TriggerConfig>;
  constructor() {
    this._elementHandlers = new WeakMap();
    this._elementSizes = new WeakMap();
    this._elementTriggerConfig = new WeakMap();
    this._resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        for (let entry of entries) {
          const size = this._elementSizes.get(entry.target);

          if (size != null) {
            const newHeight = entry.borderBoxSize[0].blockSize;
            const newWidth = entry.borderBoxSize[0].inlineSize;
            const triggerConfig = this._elementTriggerConfig.get(entry.target);
            const hasHeightChanged = newHeight !== size.height;
            const hasWidthChanged = newWidth !== size.width;
            const hasSizeChanged = hasHeightChanged || hasWidthChanged;

            size.width = newWidth;
            size.height = newHeight;

            if (hasSizeChanged) {
              const shouldTriggerHeightChange =
                hasHeightChanged &&
                (triggerConfig === TriggerConfig.Both ||
                  triggerConfig === TriggerConfig.Height);
              const shouldTriggerWidthChange =
                hasWidthChanged &&
                (triggerConfig === TriggerConfig.Both ||
                  triggerConfig === TriggerConfig.Width);
              const shouldTrigger =
                shouldTriggerHeightChange || shouldTriggerWidthChange;
              if (shouldTrigger) {
                const handlers = this._elementHandlers.get(entry.target);
                handlers?.forEach((handler) =>
                  handler(newWidth, newHeight, entry)
                );
              }
            }
          }
        }
      });
    });
  }

  register(
    element: Element,
    handler: ResizeHandler,
    triggerConfig: TriggerConfig = TriggerConfig.Both
  ) {
    this._elementSizes.set(element, {
      width: 0,
      height: 0,
    });
    this._elementTriggerConfig.set(element, triggerConfig);
    this._resizeObserver.observe(element);

    const handlers = this.getElementHandlers(element);
    handlers.push(handler);

    return () => {
      const handlerIndex = handlers.indexOf(handler);

      if (handlerIndex > -1) {
        handlers.splice(handlerIndex, 1);
      }

      if (handlers.length <= 0) {
        this._elementHandlers.delete(element);
        this._elementSizes.delete(element);
        this._elementTriggerConfig.delete(element);
        this._resizeObserver.unobserve(element);
      }
    };
  }
  getElementHandlers(element: Element) {
    let handlers = this._elementHandlers.get(element);
    if (handlers == null) {
      handlers = [];
      this._elementHandlers.set(element, handlers);
    }
    return handlers as ResizeHandler[];
  }
}

const resizeObserverRegistry = new ResizeObserverRegistry();

export function useResizeObserver<T extends Element>(
  resizeHandler: ResizeHandler,
  triggerConfig: TriggerConfig = TriggerConfig.Both
) {
  const ref = useRef<T | null>(null);
  const resizeHandlerRef = useRef<ResizeHandler>(resizeHandler);
  resizeHandlerRef.current = resizeHandler;
  
  useLayoutEffect(() => {
    const element = ref.current;
    if (element != null) {
      const unregister = resizeObserverRegistry.register(
        element,
        resizeHandlerRef.current,
        triggerConfig
      );
      return unregister;
    }
  }, [triggerConfig]);
  return ref;
}
