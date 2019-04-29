import styled from "styled-components";
import COLORS from "../config/themes/dark/colors";
import BORDER_SIZING from "../config/themes/dark/borderSizing";
import SPACING from "../config/themes/dark/spacing";

const StyledEditorWrapper = styled.div`
  padding: ${SPACING.container.padding};
  border-radius: ${BORDER_SIZING.container.radius};
  background-color: ${COLORS.default.background};
  color: ${COLORS.default.foreground};
`;

export default StyledEditorWrapper;
