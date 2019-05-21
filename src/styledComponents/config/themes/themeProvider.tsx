import React from "react";
import ReactDOM from "react-dom";
import { EditorTheme } from "./model";
const ThemeContext = React.createContext({});
interface ThemeProviderProps {
  theme: EditorTheme;
}
export default class EditorThemeProvider extends React.Component<ThemeProviderProps, any> {
  public render() {
    return <ThemeContext.Provider value={this.props.theme}>{this.props.children}</ThemeContext.Provider>;
  }
}
