import Expo, { Font } from 'expo';
import React from 'react';
import { StyleSheet, View,StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProvider, StackNavigation,withNavigation } from '@expo/ex-navigation';
import { Provider as ReduxProvider, connect } from 'react-redux';
import { List } from 'immutable';
import NavigationEvents from './utilities/NavigationEvents';

import Actions from './state/Actions';
import LocalStorage from './state/LocalStorage';
import Router from './navigation/Router';
import Store from './state/Store';
import { Event, User } from './state/Records';
import Colors from './constants/Colors';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAfKuNjJmtI3Va66HmxujtuAL4H_HNYmIY",
  authDomain: "https://weekend-1053a.firebaseapp.com/__/auth/handler",
  databaseURL: "https://weekend-1053a.firebaseio.com",
  projectId: "weekend-1053a",
  storageBucket: "weekend-1053a.appspot.com",
  messagingSenderId: "350020366916"
};

firebase.initializeApp(firebaseConfig);


export default class AppContainer extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <NavigationProvider router={Router}>
          <App {...this.props} />
        </NavigationProvider>
      </ReduxProvider> 
    );
  }
}

@withNavigation
@connect(data => App.getDataProps)
class App extends React.Component {
  static getDataProps(data) {
    return {
      currentUser: data.currentUser,
    }
  }

  state = {
    assetsReady: false,
    dataReady: false,
  };

  async componentDidMount() {
    await this._loadAssetsAsync();
    await this._loadCacheAsync();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.assetsReady || !this.state.dataReady) {
      return;
    }

    const rootNavigator = this.props.navigation.getNavigator('root');
    const previouslySignedIn = isSignedIn(prevProps.currentUser) &&
      prevState.dataReady === this.state.dataReady;
    const currentlySignedIn = isSignedIn(this.props.currentUser);

    if (!previouslySignedIn && currentlySignedIn) {
      rootNavigator.replace('tabNavigation');
    } else if (previouslySignedIn && !currentlySignedIn) {
      rootNavigator.replace('authentication');
    }
  }

  _loadAssetsAsync = async () => {
    await Font.loadAsync({
      ...MaterialIcons.font,
      'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
      'OpenSans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Bold': require('./assets/fonts/OpenSans-Semibold.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
      'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    });

    this.setState({
      assetsReady: true,
    });
  }

  _loadCacheAsync = async () => {
    let user = new User(await LocalStorage.getUserAsync());
    this.props.dispatch(Actions.setCurrentUser(user));

    this.setState({
      dataReady: true,
    });
  }

  render() {
    if (!this.state.assetsReady || !this.state.dataReady) {
      return <Expo.AppLoading />;
    }

    return (
      <View style={styles.container}>
        <StackNavigation
          id="root"
          defaultRouteConfig={{navigationBar: { backgroundColor: '#6381aa'}}}
          initialRoute={Router.getRoute('authentication')}
        />
      </View>
    );
  }
}

function isSignedIn(userState) {
  return !!userState.authToken || userState.isGuest;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
