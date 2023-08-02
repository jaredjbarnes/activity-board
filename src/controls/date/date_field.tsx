import { useAsyncValue } from "@m/hex/hooks/use_async_value";
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
  const id = useAsyncValue(adapter.idBroadcast);
  const label = useAsyncValue(adapter.labelBroadcast);

  function expand() {
    adapter.expand();
  }

  function blur() {
    adapter.contract();
  }

  return (
    <VStack
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
        tabIndex={0}
        style={{
          position: "relative",
          width: "100%",
          height: "40px",
          overflow: "hidden",
        }}
        onFocus={expand}
        onBlur={blur}
        className="input"
      >
        <HStack height="34px">
          <Box width="40px">
            <VModularScroll modularAxisAdapter={adapter.monthAxis}>
              {(cell) => {
                return <Month cell={cell} />;
              }}
            </VModularScroll>
          </Box>
          <Box width="25px">
            <VModularScroll modularAxisAdapter={adapter.dateAxis}>
              {(cell) => {
                return <DateNumber cell={cell} />;
              }}
            </VModularScroll>
          </Box>
          <Box width="15px"><Comma /></Box>
          <FlexBox>
            <VNumberScroll numberAxisAdapter={adapter.yearAxis}>
              {(cell) => {
                return <Year cell={cell} />;
              }}
            </VNumberScroll>
          </FlexBox>
        </HStack>
      </div>
    </VStack>
  );
}
