import React from "react";
import styled, { StyledProps } from "styled-components";

interface StyledGradientBorderBoxProps extends React.Props<HTMLDivElement> {
  borderRadius?: string;
  isHoverable?: boolean;
  width: string;
}

const StyledGradientBorderBox = styled.div`
  ${(props: StyledProps<StyledGradientBorderBoxProps>) => {
    return `
    padding: ${props.width || "1px"};
    background: linear-gradient(to top right, ${props.theme.colors.default.border}, ${props.theme.colors.default.border2}, ${props.theme.colors.default.border3});

    &.roundCorners {
      border-radius: ${props.borderRadius || "1px"};
    }

    ${props.isHoverable &&
      `
        &:hover {
          background: linear-gradient(
            to top right,
            ${props.theme.colors.highlight.border},
            ${props.theme.colors.highlight.border2},
            ${props.theme.colors.highlight.border3}
          );
        }
        &:active, &:focus-within {
          background: linear-gradient(
            to top right,
            ${props.theme.colors.active.border},
            ${props.theme.colors.active.border2},
            ${props.theme.colors.active.border3}
          );
        }
      `}
    `;
  }}
`;

export default StyledGradientBorderBox;
