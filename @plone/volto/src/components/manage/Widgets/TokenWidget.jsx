/**
 * ArrayWidget component.
 * @module components/manage/Widgets/ArrayWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Label, Dropdown } from 'semantic-ui-react';
import { concat, debounce, map, uniqBy } from 'lodash';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { bindActionCreators } from 'redux';
import { components } from 'react-select';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';

import {
  getVocabFromHint,
  getVocabFromField,
  getVocabFromItems,
} from '@plone/volto/helpers';
import { getVocabulary } from '../../../actions';
import { Icon } from '../../../components';

import downSVG from '../../../icons/down-key.svg';
import upSVG from '../../../icons/up-key.svg';
import checkSVG from '../../../icons/check.svg';

const messages = defineMessages({
  no_results_found: {
    id: 'No results found.',
    defaultMessage: 'No results found.',
  },
});

const Option = props => {
  // console.log(props);
  return (
    <components.Option {...props}>
      <div>{props.label}</div>
      {props.isFocused && !props.isSelected && (
        <Icon name={checkSVG} size="24px" color="#b8c6c8" />
      )}
      {props.isSelected && <Icon name={checkSVG} size="24px" color="#007bc1" />}
    </components.Option>
  );
};

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      {props.selectProps.menuIsOpen ? (
        <Icon name={upSVG} size="24px" color="#007bc1" />
      ) : (
        <Icon name={downSVG} size="24px" color="#007bc1" />
      )}
    </components.DropdownIndicator>
  );
};

const selectTheme = theme => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary25: 'hotpink',
    primary: '#b8c6c8',
  },
});

const customSelectStyles = {
  control: (styles, state) => ({
    ...styles,
    border: 'none',
    borderBottom: '2px solid #b8c6c8',
    boxShadow: 'none',
    borderBottomStyle: state.menuIsOpen ? 'dotted' : 'solid',
  }),
  menu: (styles, state) => ({
    ...styles,
    top: null,
    marginTop: 0,
    boxShadow: 'none',
    borderBottom: '2px solid #b8c6c8',
  }),
  indicatorSeparator: styles => ({
    ...styles,
    width: null,
  }),
  valueContainer: styles => ({
    ...styles,
    // paddingLeft: 0,
  }),
  option: (styles, state) => ({
    ...styles,
    backgroundColor: null,
    height: '50px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 12px',
    color: state.isSelected
      ? '#007bc1'
      : state.isFocused
      ? '#4a4a4a'
      : 'inherit',
    ':active': {
      backgroundColor: null,
    },
  }),
};

@injectIntl
@connect(
  (state, props) => {
    const vocabBaseUrl =
      getVocabFromHint(props) ||
      getVocabFromField(props) ||
      getVocabFromItems(props);
    const vocabState = state.vocabularies[vocabBaseUrl];
    if (vocabState) {
      return {
        choices: vocabState.items
          ? vocabState.items.map(item => ({
              label: item.value,
              value: item.value,
            }))
          : [],
        itemsTotal: vocabState.itemsTotal,
        loading: Boolean(vocabState.loading),
      };
    }
    return {};
  },
  dispatch => bindActionCreators({ getVocabulary }, dispatch),
)
/**
 * ArrayWidget component class.
 * @class ArrayWidget
 * @extends Component
 */
export default class ArrayWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
    getVocabulary: PropTypes.func.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    items: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    widgetOptions: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    itemsTotal: PropTypes.number,
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
    items: {
      vocabulary: null,
    },
    widgetOptions: {
      vocabulary: null,
    },
    error: [],
    choices: [],
    loading: false,
    value: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Actions
   */
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.vocabBaseUrl =
      getVocabFromHint(props) ||
      getVocabFromField(props) ||
      getVocabFromItems(props);
    this.state = {
      selectedOption: props.value
        ? props.value.map(item => ({ label: item, value: item }))
        : [],
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getVocabulary(this.vocabBaseUrl);
  }

  /**
   * Initiate search with new query
   * @param {string} query Search query.
   * @returns {undefined}
   */
  search(query) {
    if (query.length > 1) {
      this.props.getVocabulary(this.vocabBaseUrl, query);
    }
  }

  /**
   * Initiate search with new query
   * @method loadOptions
   * @param {string} search Search query.
   * @param {string} previousOptions The previous options rendered.
   * @param {string} additional Additional arguments to pass to the next loadOptions.
   * @returns {undefined}
   */
  loadOptions(search) {
    return this.props.getVocabulary(this.vocabBaseUrl, search).then(resolve =>
      this.props.choices.map(item => ({
        label: item.value,
        value: item.value,
      })),
    );
  }

  /**
   * Handle the field change, store it in the local state and back to simple
   * array of tokens for correct serialization
   * @method handleChange
   * @param {array} selectedOption The selected options (already aggregated).
   * @returns {undefined}
   */
  handleChange(selectedOption) {
    this.setState({ selectedOption });
    this.props.onChange(this.props.id, selectedOption.map(item => item.value));
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, title, required, description, error, fieldSet } = this.props;
    const { selectedOption } = this.state;
    return (
      <Form.Field
        inline
        required={required}
        error={error.length > 0}
        className={description ? 'help' : ''}
        id={`${fieldSet}-${id}`}
      >
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width="4">
              <div className="wrapper">
                <label htmlFor={`field-${id}`}>{title}</label>
              </div>
            </Grid.Column>
            <Grid.Column width="8">
              <AsyncCreatableSelect
                className="react-select-container"
                classNamePrefix="react-select"
                defaultOptions={this.props.choices || []}
                styles={customSelectStyles}
                theme={selectTheme}
                components={{ DropdownIndicator, Option }}
                isMulti
                value={selectedOption || []}
                loadOptions={this.loadOptions}
                onChange={this.handleChange}
              />
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
                <p className="help">{description}</p>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Form.Field>
    );
  }
}
