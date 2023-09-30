import { useLayoutEffect } from "react";
import { ViewportCapturePresenter } from "src/components/utils/viewport_capture/viewport_capture_presenter.ts";

export function useViewportCaptureAdapter(
  viewportCapturePresenter: ViewportCapturePresenter
) {
  useLayoutEffect(() => {
    const visualViewport = window.visualViewport;
    let cacheViewport: () => void;

    if (visualViewport == null) {
      cacheViewport = () => {
        viewportCapturePresenter.setViewport(
          0,
          window.innerWidth,
          window.innerHeight,
          0
        );
      };

      window.addEventListener("resize", cacheViewport);
      window.addEventListener("scroll", cacheViewport);

      cacheViewport();

      return () => {
        window.removeEventListener("resize", cacheViewport);
        window.removeEventListener("scroll", cacheViewport);
      };
    } else {
      let isPendingRequest = false;

      cacheViewport = () => {
        if (!isPendingRequest){
          isPendingRequest = true;
          requestAnimationFrame(() => {
            isPendingRequest = false;
            viewportCapturePresenter.setViewport(
              visualViewport.offsetTop,
              visualViewport.offsetLeft + visualViewport.width,
              visualViewport.offsetTop + visualViewport.height,
              visualViewport.offsetLeft
            );
          });
        }
        
      };

      visualViewport.addEventListener("resize", cacheViewport);
      visualViewport.addEventListener("scroll", cacheViewport);

      cacheViewport();

      return () => {
        visualViewport.removeEventListener("resize", cacheViewport);
        visualViewport.removeEventListener("scroll", cacheViewport);
      };
    }
  }, [viewportCapturePresenter]);
}
