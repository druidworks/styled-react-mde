import styled from "styled-components";

const StyledEditorTextarea = styled.textarea`
  display: block;
  height: auto;
  min-height: 200px;
  width: 99.35%;
  background-color: ${(props) => props.theme.colors.default.background};
  color: ${(props) => props.theme.colors.default.foreground};
  border: none;
  outline: none;
  resize: vertical;
  margin: ${(props) => props.theme.components.textarea.margin};
  padding: ${(props) => props.theme.components.textarea.padding};

  &:focus {
    border-color: ${(props) => props.theme.colors.active.border};
  }
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-corner {
    background-color: ${(props) => props.theme.colors.default.background};
    border: none;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to top, ${(props) => props.theme.colors.default.border}, ${(props) => props.theme.colors.default.border3});
  }
  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.colors.default.background};
  }
  &::-webkit-resizer {
    border: 2px solid ${(props) => props.theme.colors.default.background};
    background-color: ${(props) => props.theme.colors.default.border3};
    cursor: row-resize;
  }
`;

export default StyledEditorTextarea;
