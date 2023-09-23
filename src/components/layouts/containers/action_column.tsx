import React from "react";
import { Box } from "src/components/layouts/box/index.tsx";
import { FlexBox } from "src/components/layouts/flex_box/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";
import classes from "src/components/layouts/containers/action_column.module.css";

export interface ActionColumnProps {
  width?: string;
  height?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const ActionColumn = React.forwardRef(function ActionColumn(
  { width = "100%", height = "100%", header }: ActionColumnProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div className={classes.actionColumn} style={{ width, height }} ref={ref}>
      <VStack className={classes.actionColumnBoundary}>
        <Box padding="8px" height="50px">
          <Box className={classes.actionColumnHeader}>{header}</Box>
        </Box>
        <FlexBox></FlexBox>
        <Box height="50px"></Box>
      </VStack>
    </div>
  );
});
