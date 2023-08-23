import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/components/layouts/stacks/spacer.tsx";
import { DownArrow } from "src/components/utils/arrows/down_arrow.tsx";
import { LeftArrow } from "src/components/utils/arrows/left_arrow.tsx";
import { RightArrow } from "src/components/utils/arrows/right_arrow.tsx";
import { UpArrow } from "src/components/utils/arrows/up_arrow.tsx";

export default {
  title: "utils/Arrows",
};

export function Arrows() {
  return (
    <div style={{ padding: "10px" }}>
      <HStack
        width="50px"
        height="50px"
        background="white"
        borderRadius="8px"
        boxShadow="0px 0px 20px rgba(0,0,0,0.25)"
      >
        <UpArrow color="white" />
      </HStack>
      <Spacer height="20px" />
      <HStack
        width="50px"
        height="50px"
        background="white"
        borderRadius="8px"
        boxShadow="0px 0px 20px rgba(0,0,0,0.25)"
      >
        <RightArrow color="white" />
      </HStack>
      <Spacer height="20px" />
      <HStack
        width="50px"
        height="50px"
        background="white"
        borderRadius="8px"
        boxShadow="0px 0px 20px rgba(0,0,0,0.25)"
      >
        <DownArrow color="white" />
      </HStack>
      <Spacer height="20px" />
      <HStack
        width="50px"
        height="50px"
        background="white"
        borderRadius="8px"
        boxShadow="0px 0px 20px rgba(0,0,0,0.25)"
      >
        <LeftArrow color="white" />
      </HStack>
    </div>
  );
}
