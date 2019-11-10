/**
 * Root reducer.
 * @module reducers/root
 */

import { reducer as reduxAsyncConnect } from 'redux-connect';
import { intlReducer } from 'react-intl-redux';

import actions from '@plone/volto/reducers/actions/actions';
import breadcrumbs from '@plone/volto/reducers/breadcrumbs/breadcrumbs';
import comments from '@plone/volto/reducers/comments/comments';
import content from '@plone/volto/reducers/content/content';
import controlpanels from '@plone/volto/reducers/controlpanels/controlpanels';
import clipboard from '@plone/volto/reducers/clipboard/clipboard';
import diff from '@plone/volto/reducers/diff/diff';
import emailNotification from '@plone/volto/reducers/emailNotification/emailNotification';
import form from '@plone/volto/reducers/form/form';
import history from '@plone/volto/reducers/history/history';
import groups from '@plone/volto/reducers/groups/groups';
import messages from '@plone/volto/reducers/messages/messages';
import navigation from '@plone/volto/reducers/navigation/navigation';
import roles from '@plone/volto/reducers/roles/roles';
import schema from '@plone/volto/reducers/schema/schema';
import search from '@plone/volto/reducers/search/search';
import sharing from '@plone/volto/reducers/sharing/sharing';
import tiles from '@plone/volto/reducers/tiles/tiles';
import types from '@plone/volto/reducers/types/types';
import users from '@plone/volto/reducers/users/users';
import userSession from '@plone/volto/reducers/userSession/userSession';
import vocabularies from '@plone/volto/reducers/vocabularies/vocabularies';
import workflow from '@plone/volto/reducers/workflow/workflow';

/**
 * Root reducer.
 * @function
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
const reducers = {
  intl: intlReducer,
  reduxAsyncConnect,
  actions,
  breadcrumbs,
  comments,
  content,
  controlpanels,
  clipboard,
  diff,
  emailNotification,
  form,
  groups,
  history,
  messages,
  navigation,
  roles,
  schema,
  search,
  sharing,
  tiles,
  types,
  users,
  userSession,
  vocabularies,
  workflow,
};

export default reducers;
