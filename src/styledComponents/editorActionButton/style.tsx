import styled from "styled-components";

const StyledEditorActionButton = styled.div`
  display: inline-block;
  padding: ${(props) => props.theme.components.button.padding};
  margin: 0;
  width: 30px;
  text-align: center;
  background-color: ${(props) => props.theme.colors.default.background};
  border-radius: ${(props) => props.theme.components.button.radius};
  color: ${(props) => props.theme.colors.default.foreground};

  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer */
  -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
  -webkit-user-select: none; /* Chrome, Safari, and Opera */
  -webkit-touch-callout: none; /* Disable Android and iOS callouts*/

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.highlight.background};
    color: ${(props) => props.theme.colors.highlight.foreground};
  }
  &:active {
    background-color: ${(props) => props.theme.colors.active.background};
    color: ${(props) => props.theme.colors.active.foreground};
  }
`;

export default StyledEditorActionButton;
