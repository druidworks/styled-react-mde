import React from "react";
import styled from "styled-components";
import COLORS from "../config/themes/dark/colors";

interface StyledGradientBorderBoxProps extends React.Props<HTMLDivElement> {
  borderRadius?: string;
  isHoverable?: boolean;
  width: string;
}

const StyledGradientBorderBox = styled.div`
  padding: ${(props: StyledGradientBorderBoxProps) => props.width || "1px"};
  background: linear-gradient(to top right, ${COLORS.default.border}, ${COLORS.default.border2}, ${COLORS.default.border3});

  ${(props: StyledGradientBorderBoxProps) => {
    if (props.isHoverable) {
      return `
        &:hover {
          background: linear-gradient(
            to top right,
            ${COLORS.highlight.border},
            ${COLORS.highlight.border2},
            ${COLORS.highlight.border3}
          );
        }
        &:active, &:focus-within {
          background: linear-gradient(
            to top right,
            ${COLORS.active.border},
            ${COLORS.active.border2},
            ${COLORS.active.border3}
          );
        }
      `;
    }

    return null;
  }};

  &.roundCorners {
    border-radius: ${(props: StyledGradientBorderBoxProps) => props.borderRadius || "1px"};
  }
`;

export default StyledGradientBorderBox;
