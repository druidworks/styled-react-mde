import * as React from "react";
// import Markdown from "markdown-to-jsx";
import ReactMarkdown from "react-markdown";
import { Key } from "ts-keycode-enum";
import StatusBar from "../styledComponents/statusBar";
import EditorWrapper from "../styledComponents/editorWrapper";
import EditorActionBar from "../styledComponents/editorActionBar";
import EditorActionButton from "../styledComponents/editorActionButton";
import EditorTextarea from "../styledComponents/editorTextarea";
import StatusBarText from "../styledComponents/statusBarText";
import StatusBarSeperator from "../styledComponents/statusBarSeperator";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface EditorProps {
  textAreaProps: TextAreaProps;
  characterLimit?: number;
  wordLimit?: number;
  headless?: boolean;
  updateSelectionHandler: (selection: EditorSelection) => void;
}

export interface EditorState {
  content: string;
  selection: EditorSelection;
  isInPreview: boolean;
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
      selection: { startOffset: 0, endOffset: 0 },
      isInPreview: false
    };
    this.textarea = null;
    this.selectionUpdateEvents = ["select", "click", "focus", "keyup"];
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onChange = this.onChange.bind(this);
    this.selectionUpdateListener = this.selectionUpdateListener.bind(this);
    this.togglePreviewMode = this.togglePreviewMode.bind(this);
  }

  public render() {
    return (
      <EditorWrapper>
        {!this.props.headless && (
          <EditorActionBar disabled={this.state.isInPreview}>
            <EditorActionButton onClickMethod={() => this.boldSelection()}>B</EditorActionButton>
            <EditorActionButton onClickMethod={() => this.italicSelection()}>I</EditorActionButton>
            <EditorActionButton onClickMethod={() => this.emphasizeSelection()}>E</EditorActionButton>
            <EditorActionButton onClickMethod={() => this.quoteSelection()}>Q</EditorActionButton>
            <EditorActionButton onClickMethod={() => this.unOrderedListSelection()}>U</EditorActionButton>
            <EditorActionButton onClickMethod={() => this.orderedListSelection()}>O</EditorActionButton>
          </EditorActionBar>
        )}

        {this.state.isInPreview && <ReactMarkdown source={this.state.content} />}

        {!this.state.isInPreview && (
          <EditorTextarea
            referenceCallback={(c: any) => {
              this.textarea = c;
            }}
            {...this.props.textAreaProps}
            value={this.state.content}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
          />
        )}

        <StatusBar>
          <EditorActionButton onClickMethod={this.togglePreviewMode}>{this.state.isInPreview ? "Edit" : "Preview"}</EditorActionButton>
          {!this.state.isInPreview && <StatusBarText>Cursor: {this.getCursorStatus()}</StatusBarText>}
          <StatusBarSeperator />
          <StatusBarText>
            Words: {this.getWordCount()} {this.getWordLimit()}
          </StatusBarText>
          <StatusBarSeperator />
          <StatusBarText>
            Characters: {this.getCharacterCount()} {this.getCharacterLimit()}
          </StatusBarText>
        </StatusBar>
      </EditorWrapper>
    );
  }

  public componentDidMount() {
    this.addEventListeners();
  }

  public componentWillUnmount() {
    this.removeEventListeners();
  }

  public componentDidUpdate(prevProps: EditorProps, prevState: EditorState) {
    if (prevState.isInPreview !== this.state.isInPreview) {
      if (this.state.isInPreview) {
        this.removeEventListeners();
      } else {
        this.addEventListeners();
      }
    }
  }

  private addEventListeners() {
    this.selectionUpdateEvents.forEach((eventType) => {
      if (this.textarea !== null) {
        this.textarea.addEventListener(eventType, this.selectionUpdateListener);
      }
    });
  }

  private removeEventListeners() {
    this.selectionUpdateEvents.forEach((eventType) => {
      if (this.textarea !== null) {
        this.textarea.removeEventListener(eventType, this.selectionUpdateListener);
      }
    });
  }

  private togglePreviewMode() {
    this.setState({ isInPreview: !this.state.isInPreview });
  }

  private getWordLimit() {
    return this.props.wordLimit ? ` / ${this.props.wordLimit}` : "";
  }

  private getWordCount(content?: string) {
    const regex = new RegExp(/\w+/g);
    const matches = (content ? content : this.state.content).match(regex);
    return matches === null ? 0 : matches.length;
  }

  private getCharacterLimit() {
    return this.props.characterLimit ? ` / ${this.props.characterLimit}` : "";
  }

  private getCharacterCount(content?: string) {
    return (content ? content : this.state.content).length;
  }

  private getCursorStatus() {
    return this.state.selection.startOffset === this.state.selection.endOffset ? this.state.selection.startOffset : `${this.state.selection.startOffset}:${this.state.selection.endOffset}`;
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

    if (this.props.wordLimit && this.getWordCount(content) > this.props.wordLimit) {
      // remove extra words
      const words = content.split(" ");
      if (words.length > this.props.wordLimit) {
        words.length = this.props.wordLimit;
        content = words.join(" ");
      }
    }

    if (this.props.characterLimit && this.getCharacterCount(content) > this.props.characterLimit) {
      // remove extra characters
      content = content.slice(0, this.props.characterLimit);
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
    this.updateTextarea(textAreaElement.value, this.getSelection(textAreaElement));
  }

  private updateTextarea(content: string, selection: EditorSelection) {
    const textAreaElement = this.textarea as HTMLTextAreaElement;
    const updatedContent = content || textAreaElement.value;
    const updatedSelection = selection || this.getSelection(this.textarea as HTMLTextAreaElement);

    if (this.props.updateSelectionHandler) {
      this.props.updateSelectionHandler(selection);
    }

    this.updateState(
      {
        content: updatedContent,
        selection: updatedSelection
      },
      () => this.setSelectionToDOM(this.textarea as HTMLTextAreaElement, updatedSelection)
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

  private setSelectionToDOM(textareaRef: HTMLTextAreaElement, selection: EditorSelection) {
    textareaRef.setSelectionRange(selection.startOffset, selection.endOffset);
  }

  private onKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.ctrlKey) {
      switch (e.keyCode) {
        case Key.B:
          this.boldSelection();
          break;
        case Key.I:
          this.italicSelection();
          break;
        case Key.E:
          this.emphasizeSelection();
          break;
        case Key.Q:
          this.quoteSelection();
          break;
        case Key.U:
          this.unOrderedListSelection();
          break;
        case Key.O:
          this.orderedListSelection();
          break;
      }
    }
    // monitor tab / shift keys are held
  }

  private boldSelection() {
    this.wrapSelection("**", /\*\*/);
  }

  private italicSelection() {
    this.wrapSelection("_", /\_/);
  }

  private emphasizeSelection() {
    this.wrapSelection("`", /\`/);
  }

  private quoteSelection() {
    this.prefixLine(">");
  }

  private unOrderedListSelection() {
    this.prefixLine("*");
  }

  private orderedListSelection() {
    this.prefixLine("#");
  }

  private getSelectionOffset(offset: number = 0) {
    const selection = this.state.selection;
    const content = this.state.content;

    const initialStart = selection.startOffset - offset;
    const startNewLines = this.getNewlinesBetween(0, initialStart);
    const start = startNewLines > 1 ? initialStart + startNewLines : initialStart;

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
    return Array.isArray(newLineMatches) && newLineMatches.length > 0 ? newLineMatches.length : 0;
  }

  private getSelectedText(offset: number = 0) {
    const selectionOffset = this.getSelectionOffset(offset);
    return this.sliceContent(selectionOffset.start, selectionOffset.end);
  }

  private replaceSubString(content: string, text: string, start: number, end: number) {
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
    if (!this.state.isInPreview) {
      const exactText = this.getSelectedText();
      const exactTextTrimmed = exactText.trim();
      const offsetText = this.getSelectedText(2);
      const isExactWrapped = this.isTextWrapped(exactTextTrimmed, tag);
      const isOffsetWrapped = this.isTextWrapped(offsetText, tag);
      const removeTag = new RegExp(regexTag, "g");
      const selection = this.getSelectionOffset();

      if (isExactWrapped) {
        this.updatedSelectedText(exactTextTrimmed.replace(removeTag, ""), selection.start + exactText.indexOf(exactTextTrimmed), exactTextTrimmed.length);
      } else if (isOffsetWrapped) {
        const selectionLength = selection.end + 2 - (selection.start - 2);
        this.updatedSelectedText(offsetText.replace(removeTag, ""), selection.start - 2, selectionLength);
      } else if (exactTextTrimmed !== "") {
        this.updatedSelectedText(`${tag}${exactTextTrimmed}${tag}`, selection.start + exactText.indexOf(exactTextTrimmed), exactTextTrimmed.length);
      }
    }
  }

  private prefixLine(tag: string) {
    if (!this.state.isInPreview) {
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
        const selectionStartInLine = selection.startOffset >= lineStart && selection.startOffset <= lineEnd;
        const selectionEndInLine = selection.endOffset >= lineStart && selection.endOffset <= lineEnd;
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
            content = this.replaceSubString(content, lineContent.replace(`${tag} `, ""), lineStart - compoundedLength, lineEnd);
          } else {
            content = this.replaceSubString(content, `${tag} ${lineContent}`, lineStart + compoundedLength, lineEnd);
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
}
