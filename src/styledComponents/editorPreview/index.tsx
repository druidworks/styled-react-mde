import React from "react";
import StyledEditorPreview from "./style";
import GradientBorderBox from "../gradientBorderBox";
import { ThemeConsumer } from "styled-components";

interface EditorPreviewProps extends React.HTMLProps<HTMLDivElement> {}

export default function EditorPreview(props: EditorPreviewProps) {
  return (
    <ThemeConsumer>
      {(theme) => (
        <GradientBorderBox width={theme.components.preview.size} borderRadius={theme.components.preview.radius}>
          <StyledEditorPreview>{props.children}</StyledEditorPreview>
        </GradientBorderBox>
      )}
    </ThemeConsumer>
  );
}
