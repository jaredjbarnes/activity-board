import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { ReadonlyObservableValue } from "@m/hex/observable_value";
import React from "react";
import { makeContextHook } from "src/components/utils/hooks/make_context_hook.ts";
import { Viewport } from "src/components/utils/viewport_capture/viewport_capture_presenter.ts";

export const ViewportContext = React.createContext<
  ReadonlyObservableValue<Viewport> | undefined
>(undefined);

export interface ViewportCaptureProviderProps {
  value: ReadonlyObservableValue<Viewport>;
  children?: React.ReactNode;
}

const useViewportBroadcast = makeContextHook(ViewportContext);

export const useViewport = () => {
  return useAsyncValue(useViewportBroadcast());
};

export const ViewportCaptureProvider = function ({
  value,
  children,
}: ViewportCaptureProviderProps) {
  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  );
};
