import { AsyncStorage } from 'react-native';

const Keys = {
  User: 'EvelyUser',
  AttendingEvents: 'EvelyAttending'
};

async function getUserAsync() {
  let results = await AsyncStorage.getItem(Keys.User);

  try {
    return JSON.parse(results);
  } catch(e) {
    return null;
  }
}

function saveUserAsync(user) {
  return AsyncStorage.setItem(Keys.User, JSON.stringify(user));
}

function removeUserAsync() {
  return AsyncStorage.removeItem(Keys.User);
}

function saveAttendingEventsAsync(eventIds) {
  return AsyncStorage.setItem(Keys.AttendingEvents, JSON.stringify(eventIds));
}

async function getAttendingEventsAsync() {
  let results = await AsyncStorage.getItem(Keys.AttendingEvents);

  try {
    return JSON.parse(results);
  } catch(e) {
    return null;
  }
}


function clearAllAsync() {
  return AsyncStorage.clear();
}

export default {
  saveUserAsync,
  getUserAsync,
  removeUserAsync,
  saveAttendingEventsAsync,
  getAttendingEventsAsync,
  clearAllAsync,
};
