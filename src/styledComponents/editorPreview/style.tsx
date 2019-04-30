import styled from "styled-components";
import SPACING from "../config/themes/dark/spacing";
import BORDER_SIZING from "../config/themes/dark/borderSizing";
import COLORS from "../config/themes/dark/colors";

const StyledEditorPreview = styled.div`
  height: 200px;
  overflow-y: auto;
  padding: ${SPACING.preview.padding};
  margin: ${SPACING.preview.margin};
  border-radius: ${BORDER_SIZING.preview.radius};
  background-color: ${COLORS.default.background};
  color: ${COLORS.default.foreground};

  & h1,
  & h2,
  & h3 {
    padding: 0;
    margin: 5px 0 10px 0;
  }

  & p {
    padding: 0;
    margin: 0 0 5px 0;
  }

  & ul,
  & ol {
    padding: 0;
    margin: 0 0 10px 25px;
  }

  & li {
    padding: 0;
    margin: 0 0 5px 0;
  }
`;

export default StyledEditorPreview;
