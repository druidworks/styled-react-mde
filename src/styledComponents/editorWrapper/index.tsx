import React from "react";
import BORDER_SIZING from "../config/themes/dark/borderSizing";
import GradientBorderBox from "../gradientBorderBox";
import StyledEditorWrapper from "./style";

export default function EditorWrapper(props: React.Props<HTMLDivElement>) {
  return (
    <GradientBorderBox width={BORDER_SIZING.container.size} borderRadius={BORDER_SIZING.container.radius}>
      <StyledEditorWrapper>{props.children}</StyledEditorWrapper>
    </GradientBorderBox>
  );
}
