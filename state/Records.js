import { Record, List } from 'immutable';

export const EventsState = Record({
  all: new List(),
  attending: new List(),
});

export const Event = Record({
  city: '',
  description: '',
  img: '',
  lat: '',
  link: '',
  lon: '',
  street: '',
  time: '',
  timeframe: '',
  title: '',
  type: '',
  visible: '',
});

export const User = Record({
  id: null,
  authToken: null,
  name: null,
  isGuest: null,
  email:null,
  friends:[]
});
