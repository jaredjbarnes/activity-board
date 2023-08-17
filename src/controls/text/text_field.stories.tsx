import { useState } from "react";
import { Button } from "src/controls/buttons/button.tsx";
import { TextField } from "src/controls/text/text_field.tsx";
import { TextFieldAdapter } from "src/controls/text/text_field_adapter.ts";
import { FlexBox } from "src/layouts/flex_box/index.tsx";
import { HStack } from "src/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/layouts/stacks/spacer.tsx";

export default {
  title: "Controls/TextField",
  component: TextField,
};

export function Base() {
  const [fields] = useState(() => {
    return {
      firstName: new TextFieldAdapter("First Name", ""),
      lastName: new TextFieldAdapter("Last Name", ""),
      address: new TextFieldAdapter("Address", ""),
    };
  });

  return (
    <div style={{ padding: "8px" }}>
      <Spacer height="8px" />
      <TextField adapter={fields.firstName}></TextField>
      <Spacer height="8px" />
      <TextField adapter={fields.lastName}></TextField>
      <Spacer height="8px" />
      <TextField adapter={fields.address}></TextField>
      <Spacer height="8px" />
      <HStack>
        <FlexBox></FlexBox>
        <Button variant="tertiary">Cancel</Button>
        <Spacer width="8px" />
        <Button>Save</Button>
      </HStack>
    </div>
  );
}
