import * as React from "react";
import { Key } from "ts-keycode-enum";
import { StatusBar } from "../styledComponents/statusBar";
import { EditorWrapper } from "../styledComponents/editorWrapper";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface EditorProps {
  textAreaProps: TextAreaProps;
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
      content: this.cleanupContent(props.textAreaProps.value as string) || "",
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
      <EditorWrapper>
        {!this.props.headless && <div>header</div>}
        <textarea
          ref={(c) => {
            this.textarea = c;
          }}
          {...this.props.textAreaProps}
          value={this.state.content}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
        />
        <StatusBar>
          Cursor: {this.state.selection.startOffset}:
          {this.state.selection.endOffset}
        </StatusBar>
      </EditorWrapper>
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

  private cleanupContent(content: string): string {
    const nRegex = new RegExp(/\r(?!\n)/g);
    if (content.match(nRegex)) {
      content = content.replace(nRegex, "\r\n");
    }

    const rRegex = new RegExp(/(?<!\r)\n/g);
    if (content.match(rRegex)) {
      content = content.replace(rRegex, "\r\n");
    }

    return content;
  }

  private updateState(newState: any, callback?: () => void) {
    if (newState && newState.content) {
      this.setState(
        Object.assign({}, newState, {
          content: this.cleanupContent(newState.content).replace(/ +/g, " ")
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
    textareaRef.setSelectionRange(selection.startOffset, selection.endOffset);
  }

  private onKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.ctrlKey) {
      // e.stopPropagation();
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
        case Key.L:
          this.prefixLine("*");
          break;
      }
    }
    // monitor tab / shift keys are held
  }

  private getSelectionOffset(offset: number = 0) {
    const selection = this.state.selection;
    const content = this.state.content;

    const initialStart = selection.startOffset - offset;
    const startNewLines = this.getNewlinesBetween(0, initialStart);
    const start =
      startNewLines > 1 ? initialStart + startNewLines : initialStart;

    const initialEnd = selection.endOffset + offset;
    const endNewLines = this.getNewlinesBetween(0, initialEnd);
    const end = endNewLines > 1 ? initialEnd + endNewLines : initialEnd;

    return {
      start: start < 0 ? 0 : start,
      end: end > content.length ? content.length : end
    };
  }

  private sliceContent(start: number, end: number) {
    return this.state.content.slice(start, end);
  }

  private getNewlinesBetween(start: number, end: number) {
    const allContentUpToSelectionEnd = this.state.content.slice(start, end);
    const newLineMatches = allContentUpToSelectionEnd.match(/\r\n/g);
    return Array.isArray(newLineMatches) && newLineMatches.length > 0
      ? newLineMatches.length
      : 0;
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

  private updatedSelectedText(text: string, start: number, length: number) {
    let content = this.state.content;
    const end = start + length;
    content = this.replaceSubString(content, text, start, end);
    this.updateState(
      {
        content,
        selection: {
          startOffset: start,
          endOffset: end
        }
      },
      () =>
        this.setSelectionToDOM(this.textarea as HTMLTextAreaElement, {
          startOffset: start,
          endOffset: start
        })
    );
  }

  private isTextWrapped(text: string, tag: string) {
    return text.startsWith(tag) && text.endsWith(tag);
  }

  private wrapSelection(tag: string, regexTag: RegExp) {
    const exactText = this.getSelectedText();
    const exactTextTrimmed = exactText.trim();
    const offsetText = this.getSelectedText(2);
    const isExactWrapped = this.isTextWrapped(exactTextTrimmed, tag);
    const isOffsetWrapped = this.isTextWrapped(offsetText, tag);
    const removeTag = new RegExp(regexTag, "g");
    const selection = this.getSelectionOffset();

    if (isExactWrapped) {
      this.updatedSelectedText(
        exactTextTrimmed.replace(removeTag, ""),
        selection.start + exactText.indexOf(exactTextTrimmed),
        exactTextTrimmed.length
      );
    } else if (isOffsetWrapped) {
      const selectionLength = selection.end + 2 - (selection.start - 2);
      this.updatedSelectedText(
        offsetText.replace(removeTag, ""),
        selection.start - 2,
        selectionLength
      );
    } else if (exactTextTrimmed !== "") {
      this.updatedSelectedText(
        `${tag}${exactTextTrimmed}${tag}`,
        selection.start + exactText.indexOf(exactTextTrimmed),
        exactTextTrimmed.length
      );
    }
  }

  private prefixLine(tag: string) {
    let content = this.state.content;
    const lines = content.split(/\r\n/);
    const selection = this.state.selection;

    let compoundedLength = 0;
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
            lineStart - compoundedLength,
            lineEnd
          );
        } else {
          content = this.replaceSubString(
            content,
            `${tag} ${lineContent}`,
            lineStart + compoundedLength,
            lineEnd
          );
        }
      }

      if (canBreak) {
        break;
      } else if (!canBreak && canPrefix) {
        compoundedLength += 2;
      }

      let newLineOffset = 1;
      const newLineCharacters = this.sliceContent(lineEnd, lineEnd + 2);
      if (newLineCharacters.indexOf("\r\n") >= 0) {
        newLineOffset = 2;
      }
      currentLength += line.length + newLineOffset;
    }
    this.updateState({ content, selection }, () =>
      this.setSelectionToDOM(this.textarea as HTMLTextAreaElement, {
        startOffset: selection.startOffset,
        endOffset: selection.endOffset
      })
    );
  }
}
