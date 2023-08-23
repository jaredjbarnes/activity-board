import { useRef, useState } from "react";
import { Button } from "src/components/controls/buttons/button.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/components/layouts/stacks/spacer.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";
import { UpArrow } from "src/components/utils/arrows/up_arrow.tsx";
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
          <HStack
            background="white"
            width="100px"
            height="50px"
            borderRadius="10px"
            boxShadow="0px 0px 20px rgba(0,0,0,0.25)"
          >
            Hello Popover
            <UpArrow position="start" color="white" offset={10} />
          </HStack>
        </Popover>
      </HStack>
      <Spacer />
    </VStack>
  );
}
