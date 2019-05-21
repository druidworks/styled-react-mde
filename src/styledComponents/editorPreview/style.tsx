import styled from "styled-components";

const StyledEditorPreview = styled.div`
  height: 200px;
  overflow-y: auto;
  padding: ${(props) => props.theme.components.preview.padding};
  margin: ${(props) => props.theme.components.preview.margin};
  border-radius: ${(props) => props.theme.components.preview.radius};
  background-color: ${(props) => props.theme.colors.default.background};
  color: ${(props) => props.theme.colors.default.foreground};

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
