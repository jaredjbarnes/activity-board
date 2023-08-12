import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useAsyncValueEffect } from "@m/hex/hooks/use_async_value_effect";
import { useRef } from "react";
import { classnames } from "src/classnames.ts";
import { Comma } from "src/controls/date/comma.tsx";
import { DateFieldAdapter } from "src/controls/date/date_field_adapter.ts";
import { DateNumber } from "src/controls/date/date_number.tsx";
import { Month } from "src/controls/date/month.tsx";
import { Year } from "src/controls/date/year.tsx";
import { Box } from "src/layouts/box/index.tsx";
import { FlexBox } from "src/layouts/flex_box/index.tsx";
import { VModularScroll } from "src/layouts/scroll/modular/v_modular_scroll.tsx";
import { VNumberScroll } from "src/layouts/scroll/number/v_number_scroll.tsx";
import { HStack } from "src/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/layouts/stacks/spacer.tsx";
import { VStack } from "src/layouts/stacks/v_stack/index.tsx";

export interface DateFieldProps {
  adapter: DateFieldAdapter;
  width?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export function DateField({
  adapter,
  width,
  style,
  className,
}: DateFieldProps) {
  const fieldRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const scrollerContainerRef = useRef<HTMLDivElement | null>(null);
  const upperVeilRef = useRef<HTMLDivElement | null>(null);
  const lowerVeilRef = useRef<HTMLDivElement | null>(null);
  const id = useAsyncValue(adapter.idBroadcast);
  const label = useAsyncValue(adapter.labelBroadcast);
  const isExpanded = useAsyncValue(adapter.isExpandedBroadcast);

  useAsyncValueEffect((value) => {
    const input = inputRef.current;
    const field = fieldRef.current;

    if (input != null) {
      input.style.height = `${value}px`;
    }

    if (field != null) {
      field.style.height = `${value + 30}px`;
    }
  }, adapter.dynamicStyles.inputHeightBroadcast);

  useAsyncValueEffect((value) => {
    const scrollerContainer = scrollerContainerRef.current;
    const upperVeil = upperVeilRef.current;
    const lowerVeil = lowerVeilRef.current;

    if (scrollerContainer != null) {
      scrollerContainer.style.top = `${value}px`;
    }

    if (upperVeil != null) {
      upperVeil.style.top = `${value - 240}px`;
    }

    if (lowerVeil != null) {
      lowerVeil.style.top = `${value + 36}px`;
    }
  }, adapter.dynamicStyles.scrollerPosition);

  function expand() {
    adapter.expand();
  }

  function blur() {
    adapter.contract();
  }

  return (
    <VStack
      ref={fieldRef}
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
        style={{
          position: "relative",
          width: "100%",
          height: "40px",
          overflow: "hidden",
          perspective: "700px",
          perspectiveOrigin: "center center",
        }}
        onFocus={expand}
        onBlur={blur}
        className="input"
      >
        <HStack
          style={{ position: "absolute", top: "0", left: "0" }}
          ref={scrollerContainerRef}
          height="34px"
        >
          <Spacer width="8px" />
          <Box width="40px">
            <VModularScroll modularAxisAdapter={adapter.monthAxis}>
              {(cell, _, index) => {
                return <Month key={index} cell={cell} />;
              }}
            </VModularScroll>
          </Box>
          <Box width="30px">
            <VModularScroll modularAxisAdapter={adapter.dateAxis}>
              {(cell, _, index) => {
                return <DateNumber key={index} cell={cell} />;
              }}
            </VModularScroll>
          </Box>
          <Box width="10px">
            <Comma />
          </Box>
          <FlexBox style={{ overflow: "visible" }}>
            <VNumberScroll numberAxisAdapter={adapter.yearAxis}>
              {(cell, _, index) => {
                return <Year key={index} cell={cell} />;
              }}
            </VNumberScroll>
          </FlexBox>
        </HStack>
        {!isExpanded && (
          <Box style={{ position: "absolute", top: "0", left: "0" }}></Box>
        )}
        <div
          ref={upperVeilRef}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            height: "240px",
            width: "100%",
            boxSizing: "border-box",
            borderBottom: "1px solid black",
            background: "rgba(200,200,200, 0.5)",
            pointerEvents: "none",
          }}
        ></div>
        <div
          ref={lowerVeilRef}
          style={{
            position: "absolute",
            top: "40px",
            left: "0",
            height: "240px",
            width: "100%",
            boxSizing: "border-box",
            borderTop: "1px solid black",
            background: "rgba(200,200,200, 0.5)",
            pointerEvents: "none",
          }}
        ></div>
      </div>
    </VStack>
  );
}
