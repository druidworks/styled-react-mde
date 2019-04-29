import React from "react";
import BORDER_SIZING from "../config/themes/dark/borderSizing";
import GradientBorderBox from "../gradientBorderBox";
import StyledEditorTextarea from "./style";

interface EditorTextareaProps {
  referenceCallback: (ref: any) => void;
}

export default class EditorTextarea extends React.Component<EditorTextareaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>, {}> {
  public render() {
    const { children, referenceCallback, ...attributes } = this.props;
    return (
      <GradientBorderBox width={BORDER_SIZING.textarea.size} borderRadius={BORDER_SIZING.textarea.radius} isHoverable={true}>
        <StyledEditorTextarea {...attributes} ref={referenceCallback}>
          {children}
        </StyledEditorTextarea>
      </GradientBorderBox>
    );
  }
}
