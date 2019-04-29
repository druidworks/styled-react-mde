import React, { MouseEvent } from "react";
import BORDER_SIZING from "../config/themes/dark/borderSizing";
import GradientBorderBox from "../gradientBorderBox";
import StyledEditorActionButton from "./style";

interface EditorActionButtonProps extends React.HTMLProps<HTMLDivElement> {
  onClickMethod: () => void;
}

export default function EditorActionButton(props: EditorActionButtonProps) {
  return (
    <div onClick={props.onClickMethod}>
      <GradientBorderBox width={BORDER_SIZING.button.size} borderRadius={BORDER_SIZING.button.radius} isHoverable={true}>
        <StyledEditorActionButton>{props.children}</StyledEditorActionButton>
      </GradientBorderBox>
    </div>
  );
}
