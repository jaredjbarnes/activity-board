import { useState } from "react";
import { TextField } from "src/components/controls/text/text_field.tsx";
import { TextFieldAdapter } from "src/components/controls/text/text_field_adapter.ts";
import { FlexBox } from "src/components/layouts/flex_box/index.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";
import { ZStack } from "src/components/layouts/stacks/z_stack/index.tsx";
import { ViewportCapture } from "src/components/utils/viewport_capture/viewport_capture.tsx";
import { ViewportCapturePresenter } from "src/components/utils/viewport_capture/viewport_capture_presenter.ts";
import {
  ViewportCaptureProvider,
  useViewport,
} from "src/components/utils/viewport_capture/viewport_capture_provider.tsx";

export default {
  title: "Viewport Capture",
};

export class ViewportExamplePresenter {
  private _viewportCapturePresenter: ViewportCapturePresenter;
  private _textFieldAdapter: TextFieldAdapter;

  get viewportCapturePresenter() {
    return this._viewportCapturePresenter;
  }

  get textFieldAdapter() {
    return this._textFieldAdapter;
  }

  constructor() {
    this._viewportCapturePresenter = new ViewportCapturePresenter();
    this._textFieldAdapter = new TextFieldAdapter("Name", "John Smith");
  }
}

export function ViewportCaptureExample() {
  const [presenter] = useState(() => {
    return new ViewportExamplePresenter();
  });

  return (
    <ViewportCaptureProvider
      value={presenter.viewportCapturePresenter.viewportBroadcast}
    >
      <VStack>
        <TextField adapter={presenter.textFieldAdapter} />
        <FlexBox>
          <IsOpen />
        </FlexBox>
      </VStack>
      <ViewportCapture presenter={presenter.viewportCapturePresenter} />
    </ViewportCaptureProvider>
  );
}

function IsOpen() {
  const viewport = useViewport();

  return (
    <HStack
      horizontalAlignment="center"
      verticalAlignment="center"
      style={{ pointerEvents: "none" }}
    >
      <ZStack>
        <div>
          <div>Top: {viewport.top}</div>
          <div>Right: {viewport.right}</div>
          <div>Bottom: {viewport.bottom}</div>
          <div>Left: {viewport.left}</div>
        </div>
      </ZStack>
    </HStack>
  );
}
