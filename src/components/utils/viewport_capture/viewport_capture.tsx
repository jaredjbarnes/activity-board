import { ViewportCapturePresenter } from "src/components/utils/viewport_capture/viewport_capture_presenter.ts";
import { useViewportCaptureAdapter } from "src/components/utils/viewport_capture/use_viewport_capture_adapter.ts";

export interface KeyboardCaptureProps {
  presenter: ViewportCapturePresenter;
}

export function ViewportCapture({ presenter }: KeyboardCaptureProps) {
  useViewportCaptureAdapter(presenter);
  return null;
}
