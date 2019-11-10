/**
 * Diff component.
 * @module components/manage/Diff/Diff
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { filter, isEqual, map } from 'lodash';
import {
  Container,
  Icon,
  Button,
  Dropdown,
  Grid,
  Table,
} from 'semantic-ui-react';
import { Router, Link, withRouter } from 'react-router-dom';
import { Portal } from 'react-portal';
import moment from 'moment';
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  intlShape,
} from 'react-intl';
import qs from 'query-string';

import { getDiff, getSchema, getHistory } from '../../../actions';
import { getBaseUrl } from '../../../helpers';
import { DiffField, Toolbar } from '../../../components';

const messages = defineMessages({
  diff: {
    id: 'Diff',
    defaultMessage: 'Diff',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
});

@injectIntl
@connect(
  (state, props) => ({
    data: state.diff.data,
    history: state.history.entries,
    schema: state.schema.schema,
    pathname: props.location.pathname,
    one: qs.parse(props.location.search).one,
    two: qs.parse(props.location.search).two,
    view: qs.parse(props.location.search).view || 'split',
    title: state.content.data.title,
    type: state.content.data['@type'],
  }),
  dispatch => bindActionCreators({ getDiff, getSchema, getHistory }, dispatch),
)
/**
 * DiffComponent class.
 * @class DiffComponent
 * @extends Component
 */
class DiffComponent extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getDiff: PropTypes.func.isRequired,
    getSchema: PropTypes.func.isRequired,
    getHistory: PropTypes.func.isRequired,
    schema: PropTypes.objectOf(PropTypes.any),
    pathname: PropTypes.string.isRequired,
    one: PropTypes.string.isRequired,
    two: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
      }),
    ).isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        version: PropTypes.number,
        time: PropTypes.string,
        actor: PropTypes.shape({ fullname: PropTypes.string }),
      }),
    ).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    schema: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs DiffComponent
   */
  constructor(props) {
    super(props);
    this.onChangeOne = this.onChangeOne.bind(this);
    this.onChangeTwo = this.onChangeTwo.bind(this);
    this.onSelectView = this.onSelectView.bind(this);
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getSchema(this.props.type);
    this.props.getHistory(getBaseUrl(this.props.pathname));
    this.props.getDiff(
      getBaseUrl(this.props.pathname),
      this.props.one,
      this.props.two,
    );
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (
      this.props.pathname !== nextProps.pathname ||
      this.props.one !== nextProps.one ||
      this.props.two !== nextProps.two
    ) {
      this.props.getDiff(
        getBaseUrl(nextProps.pathname),
        nextProps.one,
        nextProps.two,
      );
    }
  }

  /**
   * On select view handler
   * @method onSelectView
   * @param {object} event Event object
   * @param {string} value Value
   * @returns {undefined}
   */
  onSelectView(event, { value }) {
    this.props.history.push(
      `${this.props.pathname}?one=${this.props.one}&two=${
        this.props.two
      }&view=${value}`,
    );
  }

  /**
   * On change one handler
   * @method onChangeOne
   * @param {object} event Event object
   * @param {string} value Value
   * @returns {undefined}
   */
  onChangeOne(event, { value }) {
    this.props.history.push(
      `${this.props.pathname}?one=${value}&two=${this.props.two}&view=${
        this.props.view
      }`,
    );
  }

  /**
   * On change two handler
   * @method onChangeTwo
   * @param {object} event Event object
   * @param {string} value Value
   * @returns {undefined}
   */
  onChangeTwo(event, { value }) {
    this.props.history.push(
      `${this.props.pathname}?one=${this.props.one}&two=${value}&view=${
        this.props.view
      }`,
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const versions = map(
      filter(this.props.history, entry => 'version' in entry),
      (entry, index) => ({
        text: `${index === 0 ? 'Current' : entry.version} (${moment(
          entry.time,
        ).format('LLLL')}, ${entry.actor.fullname})`,
        value: `${entry.version}`,
        key: `${entry.version}`,
      }),
    );
    return (
      <Container id="page-diff">
        <Helmet title={this.props.intl.formatMessage(messages.diff)} />
        <h1>
          <FormattedMessage
            id="Difference between revision {one} and {two} of {title}"
            defaultMessage="Difference between revision {one} and {two} of {title}"
            values={{
              one: this.props.one,
              two: this.props.two,
              title: this.props.title,
            }}
          />
        </h1>
        <Grid>
          <Grid.Column width={9}>
            <p className="description">
              <FormattedMessage
                id="You can view the difference of the revisions below."
                defaultMessage="You can view the difference of the revisions below."
              />
            </p>
          </Grid.Column>
          <Grid.Column width={3} textAlign="right">
            <Button.Group>
              {map(
                [
                  { id: 'split', label: 'Split' },
                  { id: 'unified', label: 'Unified' },
                ],
                view => (
                  <Button
                    key={view.id}
                    value={view.id}
                    active={this.props.view === view.id}
                    onClick={this.onSelectView}
                  >
                    {view.label}
                  </Button>
                ),
              )}
            </Button.Group>
          </Grid.Column>
        </Grid>
        {this.props.history.length > 0 && (
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={6}>
                  <FormattedMessage id="Base" defaultMessage="Base" />
                  <Dropdown
                    onChange={this.onChangeOne}
                    value={this.props.one}
                    selection
                    fluid
                    options={versions}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell width={6}>
                  <FormattedMessage id="Compare" defaultMessage="Compare" />
                  <Dropdown
                    onChange={this.onChangeTwo}
                    value={this.props.two}
                    selection
                    fluid
                    options={versions}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        )}
        {this.props.schema &&
          this.props.data.length > 0 &&
          map(this.props.schema.fieldsets, fieldset =>
            map(
              fieldset.fields,
              field =>
                !isEqual(
                  this.props.data[0][field],
                  this.props.data[1][field],
                ) && (
                  <DiffField
                    key={field}
                    one={this.props.data[0][field]}
                    two={this.props.data[1][field]}
                    schema={this.props.schema.properties[field]}
                    view={this.props.view}
                  />
                ),
            ),
          )}
        <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
          <Toolbar
            pathname={this.props.pathname}
            inner={
              <Link
                to={`${getBaseUrl(this.props.pathname)}/history`}
                className="item"
              >
                <Icon
                  name="arrow left"
                  size="big"
                  color="blue"
                  title={this.props.intl.formatMessage(messages.back)}
                />
              </Link>
            }
          />
        </Portal>
      </Container>
    );
  }
}

export default withRouter(DiffComponent);
