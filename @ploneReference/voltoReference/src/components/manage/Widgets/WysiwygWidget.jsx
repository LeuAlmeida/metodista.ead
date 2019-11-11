/**
 * WysiwygWidget container.
 * @module components/manage/WysiwygWidget/WysiwygWidget
 */

import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import Editor from 'draft-js-plugins-editor';
import { stateFromHTML } from 'draft-js-import-html';
import { convertToRaw, EditorState } from 'draft-js';
import redraft from 'redraft';
import { Form, Grid, Icon, Label, TextArea } from 'semantic-ui-react';
import { map } from 'lodash';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import { settings } from '~/config';

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
});

@injectIntl
/**
 * WysiwygWidget container class.
 * @class WysiwygWidget
 * @extends Component
 */
export default class WysiwygWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    /**
     * Id of the field
     */
    id: PropTypes.string.isRequired,
    /**
     * Title of the field
     */
    title: PropTypes.string.isRequired,
    /**
     * Description of the field
     */
    description: PropTypes.string,
    /**
     * True if field is required
     */
    required: PropTypes.bool,
    /**
     * Value of the field
     */
    value: PropTypes.shape({
      /**
       * Content type of the value
       */
      'content-type': PropTypes.string,
      /**
       * Data of the value
       */
      data: PropTypes.string,
      /**
       * Encoding of the value
       */
      encoding: PropTypes.string,
    }),
    /**
     * List of error messages
     */
    error: PropTypes.arrayOf(PropTypes.string),
    /**
     * On change handler
     */
    onChange: PropTypes.func,
    /**
     * On delete handler
     */
    onDelete: PropTypes.func,
    /**
     * On edit handler
     */
    onEdit: PropTypes.func,
    /**
     * Internationalization
     */
    intl: intlShape.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    value: {
      'content-type': 'text/html',
      data: '',
      encoding: 'utf8',
    },
    error: [],
    onEdit: null,
    onDelete: null,
    onChange: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygWidget
   */
  constructor(props) {
    super(props);

    if (!__SERVER__) {
      let editorState;
      if (props.value && props.value.data) {
        const contentState = stateFromHTML(props.value.data, {
          customBlockFn: settings.FromHTMLCustomBlockFn,
        });
        editorState = EditorState.createWithContent(contentState);
      } else {
        editorState = EditorState.createEmpty();
      }

      const inlineToolbarPlugin = createInlineToolbarPlugin({
        structure: settings.richTextEditorInlineToolbarButtons,
      });

      this.state = { editorState, inlineToolbarPlugin };
    }

    this.schema = {
      fieldsets: [
        {
          id: 'default',
          title: props.intl.formatMessage(messages.default),
          fields: ['title', 'id', 'description', 'required'],
        },
      ],
      properties: {
        id: {
          type: 'string',
          title: props.intl.formatMessage(messages.idTitle),
          description: props.intl.formatMessage(messages.idDescription),
        },
        title: {
          type: 'string',
          title: props.intl.formatMessage(messages.title),
        },
        description: {
          type: 'string',
          widget: 'textarea',
          title: props.intl.formatMessage(messages.description),
        },
        required: {
          type: 'boolean',
          title: props.intl.formatMessage(messages.required),
        },
      },
      required: ['id', 'title'],
    };

    this.onChange = this.onChange.bind(this);
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * @returns {undefined}
   */
  onChange(editorState) {
    this.setState({ editorState });
    this.props.onChange(this.props.id, {
      'content-type': this.props.value
        ? this.props.value['content-type']
        : 'text/html',
      encoding: this.props.value ? this.props.value.encoding : 'utf8',
      data: ReactDOMServer.renderToStaticMarkup(
        redraft(
          convertToRaw(editorState.getCurrentContent()),
          settings.ToHTMLRenderers,
          settings.ToHTMLOptions,
        ),
      ),
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const {
      id,
      title,
      description,
      required,
      value,
      error,
      onEdit,
      onDelete,
      fieldSet,
    } = this.props;

    if (__SERVER__) {
      return (
        <Form.Field
          inline
          required={required}
          error={error.length > 0}
          className={description ? 'help' : ''}
          id={`${fieldSet}-${id}`}
        >
          <div className="wrapper">
            <label htmlFor={`field-${id}`}>{title}</label>
            <TextArea id={id} name={id} value={value ? value.data : ''} />
            {description && <p className="help">{description}</p>}
            {map(error, message => (
              <Label key={message} basic color="red" pointing>
                {message}
              </Label>
            ))}
          </div>
        </Form.Field>
      );
    }
    const { InlineToolbar } = this.state.inlineToolbarPlugin;

    return (
      <Form.Field
        inline
        required={required}
        error={error.length > 0}
        className={description ? 'help wysiwyg' : 'wysiwyg'}
      >
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width="4">
              <div className="wrapper">
                <label htmlFor={`field-${id}`}>
                  {onEdit && (
                    <i
                      aria-hidden="true"
                      className="grey bars icon drag handle"
                    />
                  )}
                  {title}
                </label>
              </div>
            </Grid.Column>
            <Grid.Column width="8">
              {onEdit && (
                <div className="toolbar">
                  <a className="item" onClick={() => onEdit(id, this.schema)}>
                    <Icon name="write square" size="large" color="blue" />
                  </a>
                  <a className="item" onClick={() => onDelete(id)}>
                    <Icon name="close" size="large" color="red" />
                  </a>
                </div>
              )}
              <div style={{ boxSizing: 'initial' }}>
                {this.props.onChange ? (
                  <Editor
                    id={`field-${id}`}
                    onChange={this.onChange}
                    editorState={this.state.editorState}
                    plugins={[
                      this.state.inlineToolbarPlugin,
                      ...settings.richTextEditorPlugins,
                    ]}
                    blockRenderMap={settings.extendedBlockRenderMap}
                    blockStyleFn={settings.blockStyleFn}
                  />
                ) : (
                  <div className="DraftEditor-root" />
                )}
              </div>
              {map(error, message => (
                <Label key={message} basic color="red" pointing>
                  {message}
                </Label>
              ))}
            </Grid.Column>
          </Grid.Row>
          {description && (
            <Grid.Row stretched>
              <Grid.Column stretched width="12">
                <span className="help">{description}</span>
              </Grid.Column>
            </Grid.Row>
          )}
          {this.props.onChange && <InlineToolbar />}
        </Grid>
      </Form.Field>
    );
  }
}
