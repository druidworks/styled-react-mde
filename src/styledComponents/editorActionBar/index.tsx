import React from "react";
import StyledEditorActionBar from "./style";
import { ThemeConsumer } from "styled-components";

interface EditorActionBarProps extends React.Props<HTMLDivElement> {
  disabled?: boolean;
}

export default function EditorActionBar(props: EditorActionBarProps) {
  const styledProps = {
    disabled: props.disabled
  };
  return <ThemeConsumer>{(theme) => <StyledEditorActionBar {...styledProps}>{props.children}</StyledEditorActionBar>}</ThemeConsumer>;
}
