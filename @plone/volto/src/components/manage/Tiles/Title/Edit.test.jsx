import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import Edit from './Edit';

const mockStore = configureStore();

global.__SERVER__ = true; // eslint-disable-line no-underscore-dangle

test('renders an edit title tile component', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
  });
  const component = renderer.create(
    <Provider store={store}>
      <Edit
        properties={{ title: 'My Title' }}
        selected={false}
        tile="1234"
        onAddTile={() => {}}
        onChangeField={() => {}}
        onSelectTile={() => {}}
        onDeleteTile={() => {}}
        onFocusPreviousTile={() => {}}
        onFocusNextTile={() => {}}
        handleKeyDown={() => {}}
        index={1}
      />
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
