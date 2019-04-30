import styled from "styled-components";
import COLORS from "../config/themes/dark/colors";
import SPACING from "../config/themes/dark/spacing";

const StyledEditorTextarea = styled.textarea`
  display: block;
  height: auto;
  min-height: 200px;
  width: 99.35%;
  background-color: ${COLORS.default.background};
  color: ${COLORS.default.foreground};
  border: none;
  outline: none;
  resize: vertical;
  margin: ${SPACING.textarea.margin};
  padding: ${SPACING.textarea.padding};

  &:focus {
    border-color: ${COLORS.active.border};
  }
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-corner {
    background-color: ${COLORS.default.background};
    border: none;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to top, ${COLORS.default.border}, ${COLORS.default.border3});
  }
  &::-webkit-scrollbar-track {
    background-color: ${COLORS.default.background};
  }
  &::-webkit-resizer {
    border: 2px solid ${COLORS.default.background};
    background-color: ${COLORS.default.border3};
    cursor: row-resize;
  }
`;

export default StyledEditorTextarea;
