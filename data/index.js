import transformEvent from './transformEvent';
import * as firebase from 'firebase';

state = {
index: 0,
routes: [{ key: 'friday', day: 0 },{ key: 'saturday', day: 1 }, { key: 'sunday', day: 2 }],
loading: false,
eventByDay: {},
};

firebase.database().ref('events').on('value', (snapshot) => {
  this.setState({eventByDay: snapshot.val()});
});

console.log(this.state.eventByDay);


export default breweries.map(b => transformBrewery(b, new Date()));