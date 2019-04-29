import React from "react";
import StyledEditorActionBar from "./style";

interface EditorActionBarProps extends React.Props<HTMLDivElement> {
  disabled?: boolean;
}

export default function EditorActionBar(props: EditorActionBarProps) {
  const styledProps = {
    disabled: props.disabled
  };
  return <StyledEditorActionBar {...styledProps}>{props.children}</StyledEditorActionBar>;
}
