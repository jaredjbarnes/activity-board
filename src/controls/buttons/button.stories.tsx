import { Button } from "src/controls/buttons/button.tsx";
import { FlexBox } from "src/layouts/flex_box/index.tsx";
import { HStack } from "src/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/layouts/stacks/spacer.tsx";

export default {
  title: "Controls/Button",
  component: Button,
};

export function Basic() {
  return (
    <HStack height="100px">
      <FlexBox></FlexBox>
      <Button variant="tertiary">Text</Button>
      <Spacer width="10px" />
      <Button variant="secondary">Secondary</Button>
      <Spacer width="10px" />
      <Button variant="primary">Primary</Button>
      <FlexBox></FlexBox>
    </HStack>
  );
}
