import React from "react";
import GradientBorderBox from "../gradientBorderBox";
import StyledEditorTextarea from "./style";
import { ThemeConsumer } from "styled-components";

interface EditorTextareaProps {
  referenceCallback: (ref: any) => void;
}

export default class EditorTextarea extends React.Component<EditorTextareaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>, {}> {
  public render() {
    const { children, referenceCallback, ...attributes } = this.props;
    return (
      <ThemeConsumer>
        {(theme) => (
          <GradientBorderBox width={theme.components.textarea.size} borderRadius={theme.components.textarea.radius} isHoverable={true}>
            <StyledEditorTextarea {...attributes} ref={referenceCallback}>
              {children}
            </StyledEditorTextarea>
          </GradientBorderBox>
        )}
      </ThemeConsumer>
    );
  }
}
