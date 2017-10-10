import React from 'react';
import { Alert, Image, Platform, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Facebook } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import FadeIn from '@expo/react-native-fade-in-image';

import Actions from '../state/Actions';
import Layout from '../constants/Layout';
import { RegularText } from '../components/StyledText';
import { User } from '../state/Records';
import * as firebase from 'firebase';
import PurpleGradient from '../components/PurpleGradient';
import { LinearGradient } from 'expo';



@connect()
export default class AuthenticationScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <FadeIn placeholderStyle={{backgroundColor: 'transparent'}}>
            <Image
              style={{width: 150, height: 244, marginBottom: 30,}}
              source={require('../assets/images/logo.png')}
            />
          </FadeIn>

          <TouchableNativeFeedback onPress={this._signInWithFacebook}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
              
              <RegularText style={{
              backgroundColor: 'transparent',
              fontSize: 15,
              color: '#fff',}}>
                Sign in with Facebook
              </RegularText>
            </LinearGradient>
          </TouchableNativeFeedback>

        </View>
      </View>
    );
  }

  _signInWithFacebook = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('471919983195098', {
      permissions: ['public_profile', 'email', 'user_friends'],
      behavior: Platform.OS === 'ios' ? 'web' : 'system',
    });

    if (type === 'success') {
      let response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,friends&access_token=${token}`);
      let info = await response.json();
      console.log(info);
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      firebase.auth().signInWithCredential(credential).catch((error) => {
        // Handle Errors here.
      })
      var arrayLength = info.friends.data.length;
      for (var i = 0; i < arrayLength; i++) {
        console.log(info.friends.data[i])
      };

      this.props.dispatch(Actions.signIn(new User({
        id: info.id,
        authToken: token,
        name: info.name,
        isGuest: false,
        email: info.email,
        friends:info.friends.data
      })));

      this._checkForFirstTime(info);

    }
  }


  _checkForFirstTime(info) {
    userId = info.id;
    firebase.database().ref('users').orderByChild("uid").equalTo(userId).on('value', (snapshot) => {
      var exists = (snapshot.val() !== null);
      if (!exists) {
        firebase.database().ref('users').push({
         name: info.name, 
         uid: info.id,
         email: info.email, 
         friends:info.friends.data
        });
      }
    });
  }


  _continueAsGuest = () => {
    this.props.dispatch(Actions.signIn(new User({isGuest: true})));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 5,
    width: 250,
  },
  guestButton: {
    marginTop: 15,
    backgroundColor: '#eee',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    width: 250,
  },
  facebookButtonText: {
    fontSize: 15,
    color: '#fff',
  },
  guestButtonText: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.9)',
  },
});
