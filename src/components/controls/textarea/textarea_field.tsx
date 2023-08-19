import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import React from "react";
import { ChangeEvent } from "react";
import { FieldPort } from "src/components/controls/field_port.ts";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";

export interface TextareaFieldProps {
  adapter: FieldPort<string>;
  width?: string;
  height?: string;
}

export const TextareaField = React.forwardRef(function TextareaField(
  { adapter, width = "100%", height = "150px" }: TextareaFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const id = useAsyncValue(adapter.idBroadcast);
  const label = useAsyncValue(adapter.labelBroadcast);
  const value = useAsyncValue(adapter.valueBroadcast);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    adapter.setValue(event.target.value);
  }

  return (
    <VStack ref={ref} className="text-field" height="70" width={width}>
      <HStack horizontalAlignment="start">
        <label htmlFor={id}>{label}</label>
      </HStack>
      <textarea
        id={id}
        value={value}
        className="input"
        style={{ width, height, resize: "none" }}
        onChange={handleChange}
      />
    </VStack>
  );
});
