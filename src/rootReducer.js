import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';
import contactsReducer from './containers/contactsReducer';

export default combineReducers({
  routing: routerReducer,
  contactsReducer
});