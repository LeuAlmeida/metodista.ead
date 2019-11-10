/**
 * Edit html tile.
 * @module components/manage/Tiles/HTML/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import { Button } from 'semantic-ui-react';
import cx from 'classnames';
import pretty from 'pretty';

import { Icon } from '../../../../components';
import showSVG from '../../../../icons/show.svg';
import clearSVG from '../../../../icons/clear.svg';
import codeSVG from '../../../../icons/code.svg';

/**
 * Edit html tile class.
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
    selected: PropTypes.bool.isRequired,
    tile: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    onChangeTile: PropTypes.func.isRequired,
    onSelectTile: PropTypes.func.isRequired,
    onDeleteTile: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.data.html || '',
      isPreview: false,
    };
    this.onChangeCode = this.onChangeCode.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.onCodeEditor = this.onCodeEditor.bind(this);
  }

  /**
   * Component will receive props
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.props.selected) {
      this.codeEditor._input.focus();
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected) {
      this.codeEditor._input.focus();
    }
  }

  /**
   * Change html handler
   * @method onChangeCode
   * @param {string} code New value html
   * @returns {undefined}
   */
  onChangeCode(code) {
    this.props.onChangeTile(this.props.tile, {
      ...this.props.data,
      html: code,
    });
    this.setState({ code });
  }

  /**
   * Preview mode handler
   * @method onPreview
   * @returns {undefined}
   */
  onPreview() {
    this.setState({
      isPreview: !this.state.isPreview,
      code: pretty(this.state.code),
    });
  }

  /**
   * Code Editor mode handler
   * @method onPreview
   * @returns {undefined}
   */
  onCodeEditor() {
    this.setState({ isPreview: !this.state.isPreview });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div
        role="presentation"
        onClick={() => this.props.onSelectTile(this.props.tile)}
        className={cx('tile html', {
          selected: this.props.selected,
        })}
        tabIndex={0}
        onKeyDown={e =>
          this.props.handleKeyDown(
            e,
            this.props.index,
            this.props.tile,
            this.node,
            { disableEnter: true },
          )
        }
        ref={node => {
          this.node = node;
        }}
      >
        {this.props.selected && !!this.state.code && (
          <div className="toolbar">
            <Button.Group>
              <Button
                icon
                basic
                active={!this.state.isPreview}
                onClick={this.onCodeEditor}
              >
                <Icon name={codeSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                active={this.state.isPreview}
                onClick={this.onPreview}
              >
                <Icon name={showSVG} size="24px" />
              </Button>
            </Button.Group>
            <div className="separator" />
            <Button.Group>
              <Button icon basic onClick={() => this.onChangeCode('')}>
                <Icon name={clearSVG} size="24px" color="#e40166" />
              </Button>
            </Button.Group>
          </div>
        )}
        {this.state.isPreview && (
          <div dangerouslySetInnerHTML={{ __html: this.state.code }} />
        )}
        {!this.state.isPreview && (
          <Editor
            value={this.state.code}
            placeholder={`<p>Add some HTML here</p>`}
            onValueChange={code => this.onChangeCode(code)}
            highlight={code => highlight(code, languages.html)}
            padding={8}
            className="html-editor"
            ref={node => {
              this.codeEditor = node;
            }}
          />
        )}
      </div>
    );
  }
}
