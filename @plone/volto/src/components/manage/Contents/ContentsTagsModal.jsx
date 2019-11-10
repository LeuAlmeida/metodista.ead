/**
 * Contents tags modal.
 * @module components/manage/Contents/ContentsTagsModal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { without, union, map } from 'lodash';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import { updateContent } from '../../../actions';
import { ModalForm } from '../../../components';

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  tags: {
    id: 'Tags',
    defaultMessage: 'Tags',
  },
  tagsToRemove: {
    id: 'Tags to remove',
    defaultMessage: 'Tags to remove',
  },
  tagsToAdd: {
    id: 'Tags to add',
    defaultMessage: 'Tags to add',
  },
});

@injectIntl
@connect(
  state => ({
    request: state.content.update,
  }),
  dispatch => bindActionCreators({ updateContent }, dispatch),
)
/**
 * ContentsTagsModal class.
 * @class ContentsTagsModal
 * @extends Component
 */
export default class ContentsTagsModal extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    updateContent: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        subjects: PropTypes.arrayOf(PropTypes.string),
        url: PropTypes.string,
      }),
    ).isRequired,
    request: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs ContentsUploadModal
   */
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.request.loading && nextProps.request.loaded) {
      this.props.onOk();
    }
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {Object} data Form data
   * @returns {undefined}
   */
  onSubmit(data) {
    this.props.updateContent(
      map(this.props.items, item => item.url),
      map(this.props.items, item => ({
        subjects: union(
          without(item.subjects, ...data.tags_to_remove),
          data.tags_to_add,
        ),
      })),
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      this.props.open && (
        <ModalForm
          open={this.props.open}
          onSubmit={this.onSubmit}
          onCancel={this.props.onCancel}
          title={this.props.intl.formatMessage(messages.tags)}
          formData={{
            tags_to_remove: [],
            tags_to_add: [],
          }}
          schema={{
            fieldsets: [
              {
                id: 'default',
                title: this.props.intl.formatMessage(messages.default),
                fields: ['tags_to_remove', 'tags_to_add'],
              },
            ],
            properties: {
              tags_to_remove: {
                type: 'array',
                title: this.props.intl.formatMessage(messages.tagsToRemove),
              },
              tags_to_add: {
                type: 'array',
                title: this.props.intl.formatMessage(messages.tagsToAdd),
              },
            },
            required: [],
          }}
        />
      )
    );
  }
}
