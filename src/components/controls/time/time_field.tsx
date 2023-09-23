import React from "react";
import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef } from "react";
import { classnames } from "src/utils/classnames.ts";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";
import { useForkRef } from "src/components/utils/hooks/use_fork_ref.ts";
import { TimeSelector } from "src/components/controls/time/time_selector.tsx";
import { Popover } from "src/components/utils/popover/popover.tsx";

export interface TimeFieldProps {
  adapter: TimeFieldAdapter;
  width?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const TimeField = React.forwardRef(function TimeField(
  { adapter, width, style, className }: TimeFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  useAsyncValue(adapter.valueBroadcast);

  const fieldRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const id = useAsyncValue(adapter.idBroadcast);
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
        {`${adapter.getHoursLabel()}:${adapter.getMinutesLabel()} ${adapter.getMeridiemLabel()}`}
        {isSelectorOpen && (
          <Popover presenter={adapter.popoverPresenter} anchorRef={inputRef}>
            <TimeSelector adapter={adapter} />
          </Popover>
        )}
      </div>
    </VStack>
  );
});
