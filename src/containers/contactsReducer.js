import {
  FETCH_DATA_SUCCESS,
} from './constants';

const initialState = {
  users: [],
  fetching: true,
};

function contactsReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_DATA_SUCCESS: {
      return {
        ...state,
        users: action.data,
        fetching: false,
      }
    }
    default: {
      return state;
    }
  }
}

export default contactsReducer;