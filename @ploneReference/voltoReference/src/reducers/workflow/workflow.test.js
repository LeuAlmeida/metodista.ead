import workflow from './workflow';
import {
  GET_WORKFLOW,
  GET_WORKFLOW_MULTIPLE,
  TRANSITION_WORKFLOW,
} from '../../constants/ActionTypes';

describe('Workflow reducer', () => {
  it('should return the initial state', () => {
    expect(workflow()).toEqual({
      get: {
        loaded: false,
        loading: false,
        error: null,
      },
      transition: {
        loaded: false,
        loading: false,
        error: null,
      },
      history: [],
      transitions: [],
      multiple: [],
    });
  });

  it('should handle GET_WORKFLOW_PENDING', () => {
    expect(
      workflow(undefined, {
        type: `${GET_WORKFLOW}_PENDING`,
      }),
    ).toEqual({
      get: {
        loaded: false,
        loading: true,
        error: null,
      },
      transition: {
        loaded: false,
        loading: false,
        error: null,
      },
      history: [],
      transitions: [],
      multiple: [],
    });
  });

  it('should handle GET_WORKFLOW_SUCCESS', () => {
    expect(
      workflow(undefined, {
        type: `${GET_WORKFLOW}_SUCCESS`,
        result: {
          history: 'history',
          transitions: 'transitions',
        },
      }),
    ).toEqual({
      get: {
        loaded: true,
        loading: false,
        error: null,
      },
      transition: {
        loaded: false,
        loading: false,
        error: null,
      },
      history: 'history',
      transitions: 'transitions',
      multiple: [],
    });
  });

  it('should handle GET_WORKFLOW_FAIL', () => {
    expect(
      workflow(undefined, {
        type: `${GET_WORKFLOW}_FAIL`,
        error: 'failed',
      }),
    ).toEqual({
      get: {
        loaded: false,
        loading: false,
        error: 'failed',
      },
      transition: {
        loaded: false,
        loading: false,
        error: null,
      },
      history: [],
      transitions: [],
      multiple: [],
    });
  });

  it('should handle GET_WORKFLOW_MULTIPLE_PENDING', () => {
    expect(
      workflow(undefined, {
        type: `${GET_WORKFLOW_MULTIPLE}_PENDING`,
      }),
    ).toEqual({
      get: {
        loaded: false,
        loading: true,
        error: null,
      },
      transition: {
        loaded: false,
        loading: false,
        error: null,
      },
      history: [],
      transitions: [],
      multiple: [],
    });
  });

  it('should handle GET_WORKFLOW_MULTIPLE_SUCCESS', () => {
    expect(
      workflow(undefined, {
        type: `${GET_WORKFLOW_MULTIPLE}_SUCCESS`,
        result: 'result',
      }),
    ).toEqual({
      get: {
        loaded: true,
        loading: false,
        error: null,
      },
      transition: {
        loaded: false,
        loading: false,
        error: null,
      },
      history: [],
      transitions: [],
      multiple: 'result',
    });
  });

  it('should handle GET_WORKFLOW_MULTIPLE_FAIL', () => {
    expect(
      workflow(undefined, {
        type: `${GET_WORKFLOW_MULTIPLE}_FAIL`,
        error: 'failed',
      }),
    ).toEqual({
      get: {
        loaded: false,
        loading: false,
        error: 'failed',
      },
      transition: {
        loaded: false,
        loading: false,
        error: null,
      },
      history: [],
      transitions: [],
      multiple: [],
    });
  });

  it('should handle TRANSITION_WORKFLOW_PENDING', () => {
    expect(
      workflow(undefined, {
        type: `${TRANSITION_WORKFLOW}_PENDING`,
      }),
    ).toEqual({
      get: {
        loaded: false,
        loading: false,
        error: null,
      },
      transition: {
        loaded: false,
        loading: true,
        error: null,
      },
      history: [],
      transitions: [],
      multiple: [],
    });
  });

  it('should handle TRANSITION_WORKFLOW_SUCCESS', () => {
    expect(
      workflow(undefined, {
        type: `${TRANSITION_WORKFLOW}_SUCCESS`,
        result: {},
      }),
    ).toEqual({
      get: {
        loaded: false,
        loading: false,
        error: null,
      },
      transition: {
        loaded: true,
        loading: false,
        error: null,
      },
      history: [],
      transitions: [],
      multiple: [],
    });
  });

  it('should handle TRANSITION_WORKFLOW_FAIL', () => {
    expect(
      workflow(undefined, {
        type: `${TRANSITION_WORKFLOW}_FAIL`,
        error: 'failed',
      }),
    ).toEqual({
      get: {
        loaded: false,
        loading: false,
        error: null,
      },
      transition: {
        loaded: false,
        loading: false,
        error: 'failed',
      },
      history: [],
      transitions: [],
      multiple: [],
    });
  });
});
