import React from "react";
import GradientBorderBox from "../gradientBorderBox";
import StyledEditorActionButton from "./style";
import { ThemeConsumer } from "styled-components";

interface EditorActionButtonProps extends React.HTMLProps<HTMLDivElement> {
  onClickMethod: () => void;
}

export default function EditorActionButton(props: EditorActionButtonProps) {
  return (
    <ThemeConsumer>
      {(theme) => (
        <div onClick={props.onClickMethod}>
          <GradientBorderBox width={theme.components.button.size} borderRadius={theme.components.button.radius} isHoverable={true}>
            <StyledEditorActionButton>{props.children}</StyledEditorActionButton>
          </GradientBorderBox>
        </div>
      )}
    </ThemeConsumer>
  );
}
