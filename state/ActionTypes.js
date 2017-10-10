export default defineActionConstants([
  'SET_CURRENT_USER',
  'SIGN_IN',
  'SIGN_OUT',
  'SET_EVENTS',
  'SET_ATTENDING_EVENTS',
  'ADD_ATTENDING_EVENT',
  'REMOVE_ATTENDING_EVENT',
  'TOGGLE_ATTENDING_EVENT',
]);

function defineActionConstants(names) {
  return names.reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});
}
