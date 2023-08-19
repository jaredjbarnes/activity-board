import { Button } from "src/components/controls/buttons/button.tsx";
import { FlexBox } from "src/components/layouts/flex_box/index.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/components/layouts/stacks/spacer.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";

export default {
  title: "Controls/Button",
  component: Button,
};

export function Basic() {
  return (
    <VStack>
      <HStack height="100px">
        <FlexBox></FlexBox>
        <Button variant="tertiary">Text</Button>
        <Spacer width="10px" />
        <Button variant="secondary">Secondary</Button>
        <Spacer width="10px" />
        <Button variant="primary">Primary</Button>
        <FlexBox></FlexBox>
      </HStack>
      <HStack height="100px">
        <FlexBox></FlexBox>
        <Button disabled variant="tertiary">Text</Button>
        <Spacer width="10px" />
        <Button disabled variant="secondary">Secondary</Button>
        <Spacer width="10px" />
        <Button disabled variant="primary">Primary</Button>
        <FlexBox></FlexBox>
      </HStack>
      <Spacer />
    </VStack>
  );
}
