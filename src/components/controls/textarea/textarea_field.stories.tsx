import { useState } from "react";
import { Button } from "src/components/controls/buttons/button.tsx";
import { TextField } from "src/components/controls/text/text_field.tsx";
import { TextFieldAdapter } from "src/components/controls/text/text_field_adapter.ts";
import { TextareaField } from "src/components/controls/textarea/textarea_field.tsx";
import { TextareaFieldAdapter } from "src/components/controls/textarea/textarea_field_adapter.ts";
import { FlexBox } from "src/components/layouts/flex_box/index.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/components/layouts/stacks/spacer.tsx";

export default {
  title: "Controls/TextareaField",
  component: TextareaField,
};

export function Base() {
  const [fields] = useState(() => {
    return {
      firstName: new TextFieldAdapter("First Name", ""),
      lastName: new TextFieldAdapter("Last Name", ""),
      notes: new TextareaFieldAdapter("Notes", ""),
    };
  });

  return (
    <div style={{ padding: "8px" }}>
      <Spacer height="8px" />
      <TextField adapter={fields.firstName} />
      <Spacer height="8px" />
      <TextField adapter={fields.lastName} />
      <Spacer height="8px" />
      <TextareaField adapter={fields.notes} />
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
