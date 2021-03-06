import styled from "styled-components";
import StyledGradientBorderBox from "../gradientBorderBox/style";
import StyledEditorActionButton from "../editorActionButton/style";

const StyledStatusBar = styled.div`
  display: flex;
  justify-content: flex-start;
  background-color: ${(props) => props.theme.colors.default.background};
  color: ${(props) => props.theme.colors.default.foreground2};
  font-size: 13px;
  line-height: 15px;
  margin-top: 10px;
  & ${StyledGradientBorderBox} {
    & > ${StyledEditorActionButton} {
      width: auto;
      padding: 3px 4px;
    }
  }
`;

export default StyledStatusBar;
