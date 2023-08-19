import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import React from "react";
import { ChangeEvent } from "react";
import { FieldPort } from "src/components/controls/field_port.ts";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";

export interface TextFieldProps {
  adapter: FieldPort<string>;
  width?: string;
}

export const TextField = React.forwardRef(function TextField(
  { adapter, width = "100%" }: TextFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const id = useAsyncValue(adapter.idBroadcast);
  const label = useAsyncValue(adapter.labelBroadcast);
  const value = useAsyncValue(adapter.valueBroadcast);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    adapter.setValue(event.target.value);
  }

  return (
    <VStack ref={ref} className="text-field" height="70" width={width}>
      <HStack horizontalAlignment="start">
        <label htmlFor={id}>{label}</label>
      </HStack>
      <input
        type="text"
        id={id}
        value={value}
        style={{ width, height: "40px" }}
        onChange={handleChange}
      />
    </VStack>
  );
});
