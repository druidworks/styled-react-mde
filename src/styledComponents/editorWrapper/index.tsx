import React from "react";
import GradientBorderBox from "../gradientBorderBox";
import StyledEditorWrapper from "./style";
import { ThemeConsumer } from "styled-components";

export default function EditorWrapper(props: React.Props<HTMLDivElement>) {
  return (
    <ThemeConsumer>
      {(theme) => {
        return (
          <GradientBorderBox width={theme.components.container.size} borderRadius={theme.components.container.radius}>
            <StyledEditorWrapper>{props.children}</StyledEditorWrapper>
          </GradientBorderBox>
        );
      }}
    </ThemeConsumer>
  );
}
