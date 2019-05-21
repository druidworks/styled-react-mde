import { EditorTheme, EditorThemeName } from "./model";
import darkTheme from "./dark";
import lightTheme from "./light";

function getTheme(themeName?: EditorThemeName, customTheme?: EditorTheme): EditorTheme {
  switch (themeName) {
    case "custom":
      return customTheme || lightTheme;
    case "dark":
      return darkTheme;
    case "light":
    default:
      return lightTheme;
  }
}

export default getTheme;
