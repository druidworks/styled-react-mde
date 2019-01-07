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
          ref={c => {
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
      this.selectionUpdateEvents.forEach(eventType => {
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
      this.selectionUpdateEvents.forEach(eventType => {
        if (this.textarea !== null) {
          this.textarea.removeEventListener(
            eventType,
            this.selectionUpdateListener
          );
        }
      });
    removeEventListeners();
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

    this.setState(
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
      this.setState({
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
        case Key.U:
          this.wrapSelection("_", /\_/);
          break;
        case Key.I:
          this.wrapSelection("_", /\_/);
          break;
      }
    }
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

  private getSelectedText(offset: number = 0) {
    const selectionOffset = this.getSelectionOffset(offset);
    return this.state.content.slice(selectionOffset.start, selectionOffset.end);
  }

  private updatedSelectedText(text: string, offset: number = 0) {
    const selectionOffset = this.getSelectionOffset(offset);
    let content = this.state.content;
    content =
      content.substr(0, selectionOffset.start) +
      text +
      content.substr(selectionOffset.end);
    this.setState({
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
}
