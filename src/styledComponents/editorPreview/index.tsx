import React from "react";
import StyledEditorPreview from "./style";

interface EditorPreviewProps extends React.HTMLProps<HTMLDivElement> {}

export default function EditorPreview(props: EditorPreviewProps) {
  return <StyledEditorPreview>{props.children}</StyledEditorPreview>;
}
