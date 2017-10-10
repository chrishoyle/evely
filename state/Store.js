 import { applyMiddleware, combineReducers, createStore } from 'redux';
import { effectsMiddleware } from 'redux-effex';

import CurrentUserReducer from './CurrentUserReducer';
import EventsReducer from './EventsReducer';
import Effects from '../effects';

export default createStore(
  combineReducers({
    currentUser: CurrentUserReducer,
    events: EventsReducer,
  }),
  applyMiddleware(effectsMiddleware(Effects)),
);
