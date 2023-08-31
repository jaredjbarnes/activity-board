import React from "react";
import { Box } from "src/components/layouts/box/index.tsx";
import { FlexBox } from "src/components/layouts/flex_box/index.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";
import classes from "src/components/layouts/containers/action_column.module.css";
import { createStyles } from "src/utils/create_styles.ts";

const useStyles = createStyles(({ color }: { color: string }) => ({
  vStack: {
    "--border": color,
  },
}));

export interface ActionColumnProps {
  width?: string;
  height?: string;
}

export const ActionColumn = React.forwardRef(function ActionColumn(
  { width = "100%", height = "100%" }: ActionColumnProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { vStack } = useStyles({color: "red"});

  return (
    <HStack width={width} height={height} ref={ref}>
      <VStack className={classes.vStack} style={vStack}>
        <Box height="50px"></Box>
        <FlexBox></FlexBox>
        <Box height="50px"></Box>
      </VStack>
    </HStack>
  );
});
