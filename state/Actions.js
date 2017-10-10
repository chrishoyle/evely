import ActionTypes from './ActionTypes';

export default class Actions {
  static setCurrentUser(user) {
    return {
      type: ActionTypes.SET_CURRENT_USER,
      user,
    }
  }

  static signIn(user) {
    return {
      type: ActionTypes.SIGN_IN,
      user,
    }
  }

  static signOut() {
    return {
      type: ActionTypes.SIGN_OUT,
    }
  }

  static setEvents(events) {
    return {
      type: ActionTypes.SET_EVENTS,
      events,
    }
  }

  static setAttendingEvents(eventIds) {
    return {
      type: ActionTypes.SET_ATTENDING_EVENTS,
      eventIds,
    }
  }

  static toggleAttendingEvent(eventId) {
    return {
      type: ActionTypes.TOGGLE_ATTENDING_EVENT,
      eventId,
    }
  }

  static addAttendingEvent(eventId) {
    return {
      type: ActionTypes.ADD_ATTENDING_EVENT,
      eventId,
    }
  }

  static removeAttendingEvent(eventId) {
    return {
      type: ActionTypes.REMOVE_ATTENDING_EVENT,
      eventId,
    }
  }

}
