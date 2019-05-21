import React from "react";
import StyledGradientBorderBox from "./style";
import { ThemeConsumer } from "styled-components";

interface GradientBorderBoxProps extends React.Props<HTMLDivElement> {
  borderRadius?: string;
  isHoverable?: boolean;
  width: string;
}

export default function GradientBorderBox(props: GradientBorderBoxProps) {
  const roundCorners = props.borderRadius ? "roundCorners" : "";
  const styledProps = {
    width: props.width,
    borderRadius: props.borderRadius,
    isHoverable: props.isHoverable
  };
  return (
    <ThemeConsumer>
      {(theme) => (
        <StyledGradientBorderBox className={`${roundCorners}`} {...styledProps}>
          {props.children}
        </StyledGradientBorderBox>
      )}
    </ThemeConsumer>
  );
}
