import React from "react";
import StyledEditorPreview from "./style";
import GradientBorderBox from "../gradientBorderBox";
import BORDER_SIZING from "../config/themes/dark/borderSizing";

interface EditorPreviewProps extends React.HTMLProps<HTMLDivElement> {}

export default function EditorPreview(props: EditorPreviewProps) {
  return (
    <GradientBorderBox width={BORDER_SIZING.preview.size} borderRadius={BORDER_SIZING.preview.radius}>
      <StyledEditorPreview>{props.children}</StyledEditorPreview>
    </GradientBorderBox>
  );
}
