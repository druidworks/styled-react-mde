import React from "react";
import StyledStatusBarText from "./style";

interface StatusBarTextProps extends React.HTMLProps<HTMLDivElement> {}

export default function StatusBarText(props: StatusBarTextProps) {
  return <StyledStatusBarText>{props.children}</StyledStatusBarText>;
}
