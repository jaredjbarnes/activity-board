import { useState } from "react";
import { Button } from "src/components/controls/buttons/button.tsx";
import { DateField } from "src/components/controls/date/date_field.tsx";
import { DateFieldAdapter } from "src/components/controls/date/date_field_adapter.ts";
import { TextField } from "src/components/controls/text/text_field.tsx";
import { TextFieldAdapter } from "src/components/controls/text/text_field_adapter.ts";
import { TextareaField } from "src/components/controls/textarea/textarea_field.tsx";
import { TextareaFieldAdapter } from "src/components/controls/textarea/textarea_field_adapter.ts";
import { TimeField } from "src/components/controls/time/time_field.tsx";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
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
      birthDate: new DateFieldAdapter("Birth Date", new Date("June 11, 1982")),
      time: new TimeFieldAdapter("Time", 0),
    };
  });

  return (
    <div style={{ padding: "8px", height: "100%", overflow: "auto" }}>
      <Spacer height="8px" />
      <TextField adapter={fields.firstName} />
      <Spacer height="8px" />
      <TextField adapter={fields.lastName} />
      <Spacer height="8px" />
      <TextareaField adapter={fields.notes} />
      <Spacer height="8px" />
      <DateField adapter={fields.birthDate} />
      <Spacer height="8px" />
      <TimeField adapter={fields.time} />
      <Spacer height="8px" />
      <HStack height="50px">
        <FlexBox></FlexBox>
        <Button variant="tertiary">Cancel</Button>
        <Spacer width="8px" />
        <Button>Save</Button>
      </HStack>
    </div>
  );
}
