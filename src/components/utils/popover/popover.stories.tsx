import { useRef, useState } from "react";
import { Button } from "src/components/controls/buttons/button.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/components/layouts/stacks/spacer.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";
import { Popover } from "src/components/utils/popover/popover.tsx";
import { PopoverPresenter } from "src/components/utils/popover/popover_presenter.ts";

export default {
  title: "utils/Popover",
  component: Popover,
};

export function Example() {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [presenter] = useState(() => {
    return new PopoverPresenter();
  });

  function open() {
    presenter.open();
  }

  return (
    <VStack>
      <Spacer />
      <HStack>
        <Button onClick={open} ref={anchorRef}>
          Open
        </Button>
        <Popover anchorRef={anchorRef} presenter={presenter}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "4px",
              width: "300px",
              height: "100px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.25)",
              display: "grid",
              placeItems: "center center",
            }}
          >
            Hello Popover
          </div>
        </Popover>
      </HStack>
      <Spacer />
    </VStack>
  );
}

export function ExampleWithVeil() {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [presenter] = useState(() => {
    return new PopoverPresenter();
  });

  function open() {
    presenter.open();
  }

  return (
    <VStack>
      <Spacer />
      <HStack>
        <Button onClick={open} ref={anchorRef}>
          Open
        </Button>
        <Popover hasVeil anchorRef={anchorRef} presenter={presenter}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "4px",
              width: "300px",
              height: "100px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.25)",
              display: "grid",
              placeItems: "center center",
            }}
          >
            Hello Popover
          </div>
        </Popover>
      </HStack>
      <Spacer />
    </VStack>
  );
}
