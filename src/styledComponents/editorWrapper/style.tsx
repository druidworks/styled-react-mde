import styled from "styled-components";

const StyledEditorWrapper = styled.div`
  padding: ${(props) => props.theme.components.container.padding};
  border-radius: ${(props) => props.theme.components.container.radius};
  background-color: ${(props) => props.theme.colors.default.background};
  color: ${(props) => props.theme.colors.default.foreground};
`;

export default StyledEditorWrapper;
