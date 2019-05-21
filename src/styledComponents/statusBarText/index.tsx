import React from "react";
import StyledStatusBarText from "./style";
import { ThemeConsumer } from "styled-components";

interface StatusBarTextProps extends React.HTMLProps<HTMLDivElement> {}

export default function StatusBarText(props: StatusBarTextProps) {
  return <ThemeConsumer>{(theme) => <StyledStatusBarText>{props.children}</StyledStatusBarText>}</ThemeConsumer>;
}
