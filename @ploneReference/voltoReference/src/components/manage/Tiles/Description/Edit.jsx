/**
 * Edit description tile.
 * @module components/manage/Tiles/Description/Edit
 */

import React, { Component } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor, DefaultDraftBlockRenderMap, EditorState } from 'draft-js';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import cx from 'classnames';

const messages = defineMessages({
  description: {
    id: 'Add a description…',
    defaultMessage: 'Add a description…',
  },
});

const blockRenderMap = Map({
  unstyled: {
    element: 'div',
  },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

@injectIntl
/**
 * Edit description tile class.
 * @class Edit
 * @extends Component
 */
export default class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    properties: PropTypes.objectOf(PropTypes.any).isRequired,
    selected: PropTypes.bool.isRequired,
    tile: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    index: PropTypes.number.isRequired,
    onChangeField: PropTypes.func.isRequired,
    onSelectTile: PropTypes.func.isRequired,
    onDeleteTile: PropTypes.func.isRequired,
    onAddTile: PropTypes.func.isRequired,
    onFocusPreviousTile: PropTypes.func.isRequired,
    onFocusNextTile: PropTypes.func.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);

    if (!__SERVER__) {
      let editorState;
      if (props.properties && props.properties.description) {
        const contentState = stateFromHTML(props.properties.description);
        editorState = EditorState.createWithContent(contentState);
      } else {
        editorState = EditorState.createEmpty();
      }
      this.state = { editorState };
    }

    this.onChange = this.onChange.bind(this);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.properties.description &&
      this.props.properties.description !== nextProps.properties.description &&
      !this.props.selected
    ) {
      const contentState = stateFromHTML(nextProps.properties.description);
      this.setState({
        editorState: nextProps.properties.description
          ? EditorState.createWithContent(contentState)
          : EditorState.createEmpty(),
      });
    }

    if (!this.props.selected && nextProps.selected) {
      this.node.focus();
    }
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * @returns {undefined}
   */
  onChange(editorState) {
    this.setState({ editorState }, () => {
      this.props.onChangeField(
        'description',
        editorState.getCurrentContent().getPlainText(),
      );
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />;
    }
    return (
      <div
        role="presentation"
        onClick={() => this.props.onSelectTile(this.props.tile)}
        className={cx('tile description', { selected: this.props.selected })}
      >
        <Editor
          onChange={this.onChange}
          editorState={this.state.editorState}
          blockRenderMap={extendedBlockRenderMap}
          handleReturn={() => {
            this.props.onSelectTile(
              this.props.onAddTile('text', this.props.index + 1),
            );
            return 'handled';
          }}
          handleKeyCommand={(command, editorState) => {
            if (
              command === 'backspace' &&
              editorState.getCurrentContent().getPlainText().length === 0
            ) {
              this.props.onDeleteTile(this.props.tile, true);
            }
          }}
          placeholder={this.props.intl.formatMessage(messages.description)}
          blockStyleFn={() => 'documentDescription'}
          onUpArrow={() => {
            const selectionState = this.state.editorState.getSelection();
            const { editorState } = this.state;
            if (
              editorState
                .getCurrentContent()
                .getBlockMap()
                .first()
                .getKey() === selectionState.getFocusKey()
            ) {
              this.props.onFocusPreviousTile(this.props.tile, this.node);
            }
          }}
          onDownArrow={() => {
            const selectionState = this.state.editorState.getSelection();
            const { editorState } = this.state;
            if (
              editorState
                .getCurrentContent()
                .getBlockMap()
                .last()
                .getKey() === selectionState.getFocusKey()
            ) {
              this.props.onFocusNextTile(this.props.tile, this.node);
            }
          }}
          ref={node => {
            this.node = node;
          }}
        />
      </div>
    );
  }
}
