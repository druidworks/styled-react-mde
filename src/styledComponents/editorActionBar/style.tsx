import styled from "styled-components";
import COLORS from "../config/themes/dark/colors";
import StyledEditorActionButton from "../editorActionButton/style";
import StyledGradientBorderBox from "../gradientBorderBox/style";

interface StyledEditorActionBarProps extends React.Props<HTMLDivElement> {
  disabled?: boolean;
}

const StyledEditorActionBar = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0 0 10px 0;
  background-color: ${COLORS.default.background};
  color: ${COLORS.default.foreground};
  & > div {
    margin: 0 5px 0 0;
  }
  & > div:last-of-type {
    margin: 0;
  }
  ${(props: StyledEditorActionBarProps) => {
    if (props.disabled) {
      return `

      & ${StyledGradientBorderBox} {
        &, &:hover, &:active {
          background: none;
          border-color: #777;
        }
      }

      & ${StyledEditorActionButton} {
        &, &:hover, &:active {
          color: #333;
          border-color: #333;
          background-color: #777;
          cursor: default;
        }
      }
    `;
    }
    return null;
  }}
`;

export default StyledEditorActionBar;
