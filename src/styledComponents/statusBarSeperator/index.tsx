import React from "react";
import StyledStatusBarSeperator from "./style";
import { ThemeConsumer } from "styled-components";

interface StatusBarSeperatorProps extends React.HTMLProps<HTMLDivElement> {}

export default function StatusBarSeperator(props: StatusBarSeperatorProps) {
  return <ThemeConsumer>{(theme) => <StyledStatusBarSeperator> | </StyledStatusBarSeperator>}</ThemeConsumer>;
}
