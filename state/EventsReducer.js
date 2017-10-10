import ActionTypes from './ActionTypes';
import { EventsState, Event } from './Records';

class EventsReducer {
  static reduce(state = new EventsState(), action) {
    if (EventsReducer[action.type]) {
      return EventsReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_EVENTS](state, action) {
    let events = action.events.sortBy(event => event.name);
    return state.set('all', events);
  }

  static [ActionTypes.SET_ATTENDING_EVENTS](state, action) {
    return state.set('attending', action.eventIds);
  }

  static [ActionTypes.ADD_ATTENDING_EVENT](state, action) {
    let attending = state.attending.push(action.eventId);
    return state.set('attending', attending);
  }

  static [ActionTypes.REMOVE_ATTENDING_EVENT](state, action) {
    let index = state.attending.indexOf(action.eventId);

    if (index === -1) {
      return state;
    }

    return state.set('attending', state.attending.delete(index));
  }

}

export default EventsReducer.reduce;
