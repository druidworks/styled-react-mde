import React from "react";
import StyledStatusBarSeperator from "./style";

interface StatusBarSeperatorProps extends React.HTMLProps<HTMLDivElement> {}

export default function StatusBarSeperator(props: StatusBarSeperatorProps) {
  return <StyledStatusBarSeperator> | </StyledStatusBarSeperator>;
}
