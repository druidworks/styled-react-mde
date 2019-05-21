import styled from "styled-components";
import StyledEditorActionButton from "../editorActionButton/style";
import StyledGradientBorderBox from "../gradientBorderBox/style";

interface StyledEditorActionBarProps extends React.Props<HTMLDivElement> {
  disabled?: boolean;
}

const StyledEditorActionBar = styled.div`
  ${(props) => {
    return `
      display: flex;
      justify-content: flex-start;
      padding: 0 0 10px 0;
      background-color: ${props.theme.colors.default.background};
      color: ${props.theme.colors.default.foreground};
      & > div {
        margin: 0 5px 0 0;
      }
      & > div:last-of-type {
        margin: 0;
      }
      ${(actionBarProps: StyledEditorActionBarProps) => {
        if (actionBarProps.disabled) {
          return `
          & ${StyledGradientBorderBox} {
            &, &:hover, &:active {
              background: none;
              background: linear-gradient(
                to top right,
                ${props.theme.colors.disabled.border},
                ${props.theme.colors.disabled.border2},
                ${props.theme.colors.disabled.border3}
              );
            }
          }
          & ${StyledEditorActionButton} {
            &, &:hover, &:active {
              color: ${props.theme.colors.disabled.foreground};
              background-color: ${props.theme.colors.disabled.background};
              cursor: default;
            }
          }
        `;
        }
        return null;
      }}
    `;
  }}
`;

export default StyledEditorActionBar;
