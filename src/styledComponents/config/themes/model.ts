export type EditorThemeName = "dark" | "light" | "custom";

export interface EditorColorTheme {
  background: string;
  foreground: string;
  foreground2: string;
  border: string;
  border2: string;
  border3: string;
  shadow: string;
}

export interface EditorComponentTheme {
  size: string;
  radius: string;
  padding: string;
  margin: string;
}

export interface EditorTheme {
  colors: {
    default: EditorColorTheme;
    highlight: EditorColorTheme;
    active: EditorColorTheme;
    disabled: EditorColorTheme;
  };
  components: {
    container: EditorComponentTheme;
    button: EditorComponentTheme;
    textarea: EditorComponentTheme;
    preview: EditorComponentTheme;
    input: EditorComponentTheme;
  };
}
