import React from "react";
import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef } from "react";
import { classnames } from "src/utils/classnames.ts";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";
import { useForkRef } from "src/components/utils/hooks/use_fork_ref.ts";
import { monthMap } from "src/components/controls/date_scroller/month.tsx";
import { Popover } from "src/components/utils/popover/popover.tsx";
import { DateTimeFieldAdapter } from "src/components/controls/date_time/date_time_field_adapter.ts";
import { DateTimeSelector } from "src/components/controls/date_time/date_time_selector.tsx";

export interface DateTimeFieldProps {
  adapter: DateTimeFieldAdapter;
  width?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const DateTimeField = React.forwardRef(function DateField(
  { adapter, width, style, className }: DateTimeFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const fieldRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const id = useAsyncValue(adapter.idBroadcast);
  const value = useAsyncValue(adapter.valueBroadcast);
  const label = useAsyncValue(adapter.labelBroadcast);
  const forkedRef = useForkRef(ref, fieldRef);
  const isSelectorOpen = useAsyncValue(
    adapter.popoverPresenter.isOpenBroadcast
  );

  function showDateSelector() {
    adapter.popoverPresenter.open();
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
        className={`input date ${isSelectorOpen ? "open" : ""}`}
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
        <span> - </span>
        {`${adapter.timeFieldAdapter.getHoursLabel()}:${adapter.timeFieldAdapter.getMinutesLabel()} ${adapter.timeFieldAdapter.getMeridiemLabel()}`}
        {isSelectorOpen && (
          <Popover presenter={adapter.popoverPresenter} anchorRef={inputRef}>
            <DateTimeSelector adapter={adapter} />
          </Popover>
        )}
      </div>
    </VStack>
  );
});
