import * as React from "react";
import { render } from "react-dom";
import {
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  convertFromHTML,
  Entity,
  RichUtils,
  ContentBlock,
  Modifier
} from "draft-js";
import { Pill } from "./Pill";

import "./styles.css";

class HTMLConvertExample extends React.Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link
      },
      {
        strategy: findPillEntities,
        component: props => {
          return <Pill />;
        }
      }
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator)
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => this.setState({ editorState });
    this.applyLink = () => {
      const { editorState } = this.state;
      const selectionState = editorState.getSelection();

      const entity = Entity.create("LINK", "MUTABLE", {
        url: "http://foo.com"
      });

      const update = RichUtils.toggleLink(editorState, selectionState, entity);

      this.onChange(update);
    };

    this.applyPill = () => {
      const pillEditor: EditorState = this.state.editorState;
      const currentContent: ContentState = pillEditor.getCurrentContent();
      const selection = pillEditor.getSelection();
      const contentStateWithPillEntity = currentContent.createEntity(
        "PILL",
        "IMMUTABLE",
        {}
      );

      const entityKey = contentStateWithPillEntity.getLastCreatedEntityKey();

      const textWithEntity = Modifier.insertText(
        currentContent,
        selection,
        " ",
        null,
        entityKey
      );

      const newEditorState = EditorState.push(
        pillEditor,
        textWithEntity,
        "insert-characters"
      );

      this.setState({ editorState: newEditorState });
      this.onChange(newEditorState);
    };
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={{ marginBottom: 10 }}>
          How to allow the link to wrap around both text and the Custom Entity?
          <p>
            Currently, the custom entity is disappearing. To reproduce:
            <ul>
              <li>Type in some text</li>
              <li>Click 'Insert Custom Entity'</li>
              <li>Highlight both text and the Custom Entity</li>
              <li>Click 'Apply Link'</li>
              <li>Note: The Custom Entity disappears</li>
            </ul>
          </p>
        </div>
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref="editor"
          />
        </div>

        <input
          onClick={this.applyPill}
          style={styles.button}
          type="button"
          value="Insert Custom Entity"
        />
        <input
          onClick={this.applyLink}
          style={styles.button}
          type="button"
          value="Apply Link"
        />
      </div>
    );
  }
}

function findLinkEntities(contentBlock: ContentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();

    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}

const Link = props => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

function findPillEntities(contentBlock: ContentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();

    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "PILL"
    );
  }, callback);
}

const styles = {
  root: {
    fontFamily: "'Helvetica', sans-serif",
    padding: 20,
    width: 600
  },
  editor: {
    border: "2px solid #ccc",
    //cursor: "text",
    minHeight: 80,
    padding: 10
  },
  button: {
    marginTop: 10,
    marginLeft: 10,
    textAlign: "center",
    backgroundColor: "pink"
  }
};

const rootElement = document.getElementById("root");
render(<HTMLConvertExample />, rootElement);
