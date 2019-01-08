import * as React from "react";
import { Key } from "ts-keycode-enum";

export interface EditorProps {
  rows?: number;
  placeholder?: string;
  headless?: boolean;
  updateSelectionHandler: (selection: EditorSelection) => void;
}

export interface EditorState {
  content: string;
  selection: EditorSelection;
}

interface EditorSelection {
  startOffset: number;
  endOffset: number;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  public static defaultProps = {
    rows: 10,
    placeholder: "Type here..."
  };

  private textarea: HTMLTextAreaElement | null;
  private selectionUpdateEvents: string[];

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      content: "",
      selection: { startOffset: 0, endOffset: 0 }
    };
    this.textarea = null;
    this.selectionUpdateEvents = ["select", "click", "focus", "keyup"];
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onChange = this.onChange.bind(this);
    this.selectionUpdateListener = this.selectionUpdateListener.bind(this);
  }

  public render() {
    return (
      <div>
        {!this.props.headless && <div>header</div>}
        <textarea
          ref={(c) => {
            this.textarea = c;
          }}
          placeholder={this.props.placeholder}
          rows={this.props.rows}
          value={this.state.content}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
        />
        <div>
          selection: {this.state.selection.startOffset}:
          {this.state.selection.endOffset}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const addEventListeners = () =>
      this.selectionUpdateEvents.forEach((eventType) => {
        if (this.textarea !== null) {
          this.textarea.addEventListener(
            eventType,
            this.selectionUpdateListener
          );
        }
      });
    addEventListeners();
  }

  public componentWillUnmount() {
    const removeEventListeners = () =>
      this.selectionUpdateEvents.forEach((eventType) => {
        if (this.textarea !== null) {
          this.textarea.removeEventListener(
            eventType,
            this.selectionUpdateListener
          );
        }
      });
    removeEventListeners();
  }

  private updateState(newState: any, callback?: () => void) {
    if (newState && newState.content) {
      this.setState(
        Object.assign({}, newState, {
          content: newState.content.replace(/ +/g, " ")
        }),
        callback
      );
    } else {
      this.setState(newState, callback);
    }
  }

  private onChange() {
    const textAreaElement = this.textarea as HTMLTextAreaElement;
    this.updateTextarea(
      textAreaElement.value,
      this.getSelection(textAreaElement)
    );
  }

  private updateTextarea(content: string, selection: EditorSelection) {
    const textAreaElement = this.textarea as HTMLTextAreaElement;
    const updatedContent = content || textAreaElement.value;
    const updatedSelection =
      selection || this.getSelection(this.textarea as HTMLTextAreaElement);

    if (this.props.updateSelectionHandler) {
      this.props.updateSelectionHandler(selection);
    }

    this.updateState(
      {
        content: updatedContent,
        selection: updatedSelection
      },
      () =>
        this.setSelectionToDOM(
          this.textarea as HTMLTextAreaElement,
          updatedSelection
        )
    );
  }

  private selectionUpdateListener() {
    const selection = this.getSelection(this.textarea as HTMLTextAreaElement);
    if (this.props.updateSelectionHandler) {
      this.props.updateSelectionHandler(selection);
    } else {
      this.updateState({
        selection
      });
    }
  }

  private getSelection(textareaRef: HTMLTextAreaElement): EditorSelection {
    return {
      startOffset: textareaRef.selectionStart,
      endOffset: textareaRef.selectionEnd
    };
  }

  private setSelectionToDOM(
    textareaRef: HTMLTextAreaElement,
    selection: EditorSelection
  ) {
    textareaRef.selectionStart = selection.startOffset;
    textareaRef.selectionEnd = selection.endOffset;
  }

  private onKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.ctrlKey) {
      switch (e.keyCode) {
        case Key.B:
          this.wrapSelection("**", /\*\*/);
          break;
        case Key.T:
          this.wrapSelection("`", /\`/);
          break;
        case Key.I:
          this.wrapSelection("_", /\_/);
          break;
        case Key.Q:
          this.prefixLine(">");
          break;
        case Key.P:
          this.prefixLine("*");
          break;
      }
    }
    // monitor tab / shift keys are held
  }

  private getSelectionOffset(offset: number = 0) {
    const selection = this.state.selection;
    const content = this.state.content;
    const start = selection.startOffset - offset;
    const end = selection.endOffset + offset;
    return {
      start: start < 0 ? 0 : start,
      end: end > content.length ? content.length : end
    };
  }

  private sliceContent(start: number, end: number) {
    return this.state.content.slice(start, end);
  }

  private getSelectedText(offset: number = 0) {
    const selectionOffset = this.getSelectionOffset(offset);
    return this.sliceContent(selectionOffset.start, selectionOffset.end);
  }

  private replaceSubString(
    content: string,
    text: string,
    start: number,
    end: number
  ) {
    return `${content.substr(0, start)}${text}${content.substr(end)}`;
  }

  private updatedSelectedText(text: string, offset: number = 0) {
    const selectionOffset = this.getSelectionOffset(offset);
    let content = this.state.content;
    content = this.replaceSubString(
      content,
      text,
      selectionOffset.start,
      selectionOffset.end
    );
    this.updateState({
      content,
      selection: {
        startOffset: selectionOffset.start,
        endOffset: selectionOffset.end
      }
    });
  }

  private isTextWrapped(text: string, tag: string) {
    return text.startsWith(tag) && text.endsWith(tag);
  }

  private wrapSelection(tag: string, regexTag: RegExp) {
    const exactText = this.getSelectedText();
    const offsetText = this.getSelectedText(2);
    const isExactWrapped = this.isTextWrapped(exactText, tag);
    const isOffsetWrapped = this.isTextWrapped(offsetText, tag);
    const removeTag = new RegExp(regexTag, "g");
    console.log("wrapSelection: ", {
      exactText,
      isExactWrapped,
      offsetText,
      isOffsetWrapped
    });
    if (isExactWrapped) {
      this.updatedSelectedText(exactText.replace(removeTag, "")); // TODO: remove start & end tags only
    } else if (isOffsetWrapped) {
      this.updatedSelectedText(offsetText.replace(removeTag, ""), 2); // TODO: remove start & end tags only
    } else if (exactText !== "") {
      this.updatedSelectedText(`${tag}${exactText}${tag}`); // TODO: cater for white space on ends and move tags flush with word ends
    }
  }

  private prefixLine(tag: string) {
    let content = this.state.content;
    const lines = content.split(/\r|\r\n|\n/);
    const selection = this.state.selection;

    let currentLength = 0;
    let selectionStartFound = false;
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const lineStart = currentLength;
      const lineEnd = currentLength + line.length;
      const selectionStartInLine =
        selection.startOffset >= lineStart && selection.startOffset <= lineEnd;
      const selectionEndInLine =
        selection.endOffset >= lineStart && selection.endOffset <= lineEnd;
      const lineContent = this.sliceContent(lineStart, lineEnd);
      const lineContentStartsWithTag = lineContent.startsWith(`${tag} `);

      let canPrefix = false;
      let canBreak = false;
      if (selectionStartInLine && selectionEndInLine) {
        canPrefix = true;
        canBreak = true;
      } else if (selectionStartInLine) {
        selectionStartFound = true;
        canPrefix = true;
      } else if (selectionEndInLine) {
        selectionStartFound = true;
        canPrefix = true;
        canBreak = true;
      } else if (selectionStartFound) {
        canPrefix = true;
      }

      if (canPrefix) {
        // TODO: find index & length of each split value per line and calculate true line start & end for replacement.
        if (lineContentStartsWithTag) {
          content = this.replaceSubString(
            content,
            lineContent.replace(`${tag} `, ""),
            lineStart > 0 ? lineStart + 1 : 0,
            lineEnd
          );
        } else {
          content = this.replaceSubString(
            content,
            `${tag} ${lineContent}`,
            lineStart > 0 ? lineStart + 1 : 0,
            lineEnd
          );
        }
      }

      if (canBreak) {
        break;
      }

      currentLength += line.length;
    }
    this.updateState({ content, selection });
  }
}
