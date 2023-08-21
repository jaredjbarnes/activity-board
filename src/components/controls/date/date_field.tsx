import React from "react";
import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef } from "react";
import { classnames } from "src/utils/classnames.ts";
import { DateFieldAdapter } from "src/components/controls/date/date_field_adapter.ts";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";
import { useForkRef } from "src/components/utils/hooks/use_fork_ref.ts";
import { monthMap } from "src/components/controls/date/month.tsx";
import { DateSelector } from "src/components/controls/date/date_selector.tsx";
import { Popover } from "src/components/utils/popover/popover.tsx";

export interface DateFieldProps {
  adapter: DateFieldAdapter;
  width?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const DateField = React.forwardRef(function DateField(
  { adapter, width, style, className }: DateFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const fieldRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const id = useAsyncValue(adapter.idBroadcast);
  const value = useAsyncValue(adapter.valueBroadcast);
  const label = useAsyncValue(adapter.labelBroadcast);
  const forkedRef = useForkRef(ref, fieldRef);
  const isSelectorOpen = useAsyncValue(
    adapter.selectorPopoverPresenter.isOpenBroadcast
  );

  function showDateSelector() {
    adapter.showDateSelector();
  }

  function hideDateSelector() {
    adapter.hideDateSelector();
  }

  return (
    <VStack
      ref={forkedRef}
      className={classnames("text-field", className)}
      height="70px"
      width={width}
      style={style}
    >
      <HStack horizontalAlignment="start" height="30px">
        <label htmlFor={id}>{label}</label>
      </HStack>
      <div
        id={id}
        ref={inputRef}
        tabIndex={0}
        className="input date"
        style={{
          position: "relative",
          width: "100%",
          height: "40px",
          overflow: "hidden",
          lineHeight: "34px",
          cursor: "pointer",
        }}
        onClick={showDateSelector}
      >
        {`${
          monthMap[value.getMonth()]
        } ${value.getDate()}, ${value.getFullYear()}`}
        {isSelectorOpen && (
          <Popover
            onClickAway={hideDateSelector}
            presenter={adapter.selectorPopoverPresenter}
            anchorRef={inputRef}
          >
            <DateSelector adapter={adapter} />
          </Popover>
        )}
      </div>
    </VStack>
  );
});
