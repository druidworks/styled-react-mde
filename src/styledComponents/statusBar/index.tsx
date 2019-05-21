import React from "react";
import StyledStatusBar from "./style";
import { ThemeConsumer } from "styled-components";

interface StatusBarProps extends React.HTMLProps<HTMLDivElement> {}

export default function StatusBar(props: StatusBarProps) {
  return <ThemeConsumer>{(theme) => <StyledStatusBar>{props.children}</StyledStatusBar>}</ThemeConsumer>;
}
