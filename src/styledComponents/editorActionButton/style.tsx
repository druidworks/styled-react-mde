import styled from "styled-components";
import COLORS from "../config/themes/dark/colors";
import BORDER_SIZING from "../config/themes/dark/borderSizing";
import SPACING from "../config/themes/dark/spacing";

const StyledEditorActionButton = styled.div`
  display: inline-block;
  padding: ${SPACING.button.padding};
  margin: 0;
  width: 30px;
  text-align: center;
  background-color: ${COLORS.default.background};
  border-radius: ${BORDER_SIZING.button.radius};
  color: ${COLORS.default.foreground};

  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer */
  -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
  -webkit-user-select: none; /* Chrome, Safari, and Opera */
  -webkit-touch-callout: none; /* Disable Android and iOS callouts*/

  &:hover {
    cursor: pointer;
    background-color: ${COLORS.highlight.background};
    color: ${COLORS.highlight.foreground};
  }
  &:active {
    background-color: ${COLORS.active.background};
    color: ${COLORS.active.foreground};
  }
`;

export default StyledEditorActionButton;
