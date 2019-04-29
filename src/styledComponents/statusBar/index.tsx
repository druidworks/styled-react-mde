import React from "react";
import StyledStatusBar from "./style";

interface StatusBarProps extends React.HTMLProps<HTMLDivElement> {}

export default function StatusBar(props: StatusBarProps) {
  return <StyledStatusBar>{props.children}</StyledStatusBar>;
}
