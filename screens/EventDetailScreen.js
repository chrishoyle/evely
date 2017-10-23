import React from 'react';
import { Animated, ActionSheetIOS, Button, StyleSheet, View, Text, Image, TouchableOpacity,TouchableHighlight,ScrollView } from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import { format, addMinutes } from 'date-fns';
import { Colors, Images, Layout , Fonts} from '../constants';
import StatusBarUnderlay from '../components/StatusBarUnderlay';
import BackButton from '../components/BackButton';
import { maybeOpenURL } from 'react-native-app-link';
import Touchable from 'react-native-platform-touchable';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import RoundedButton from '../components/RoundedButton';
import { WebBrowser } from 'expo';
import { connect } from 'react-redux';
import { MaterialIcons,SimpleLineIcons } from '@expo/vector-icons';
import PurpleGradient from '../components/PurpleGradient';
import Actions from '../state/Actions';
import openExternalMapApp from '../utilities/openExternalMapApp';
import * as firebase from 'firebase';

const UBER_CLIENT_ID = 'abc123';

@connect((data, props) => BreakDetailScreen.getDataProps(data, props))
export default class BreakDetailScreen extends React.PureComponent {
  static getDataProps(data, props) {
    let { eventId } = props;
    let { event } = props;
    let isAttending = data.events.attending.includes(event.title);
    return {
      isAttending,
      currentUser: data.currentUser,
    }
  }

  static route = {
    navigationBar: {
      visible: false,
    },
  }
  state = {
    scrollY: new Animated.Value(0),
    friendList: {},
  };

  render() {
    let {
      isAttending,
    } = this.props;
    let { event } = this.props;
    let { eventTitle } = event.title;
    //console.log(event.title);

    let underlayOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <PurpleGradient style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <BackButton style={styles.backButton} onPress={() => this.props.navigator.pop() } />

            <View style={styles.card} onLayout={this.onCardLayout}>
              {this._renderMainImage()}
              <View style={styles.content}>
                <Text style={styles.heading}>
                  Event Details
                </Text>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionContainer}>
                    {event.description}
                  </Text>
                  <View style={{ flexDirection: 'row', padding: 10 }}>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => {
                        WebBrowser.openBrowserAsync(event.link);
                      }}>
                    <Text style={styles.buttonText}>
                      More Info
                    </Text>
                  </TouchableOpacity>
                  {this._renderActionSheet()}
                  </View>

                  <View>
                    <View style={styles.card}>
                      <TouchableOpacity
                        style={styles.buttonGoingContainer}
                        onPress={this._onToggleAttending}
                        fallback={TouchableHighlight}>
                        <Text style={styles.buttonGoingText}>
                          { isAttending ? "I've changed my mind" : "I'm going!" }
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              </View>
            </View>
            <View>
            <View style={styles.mapActions}>
              <Touchable
                background={Touchable.Ripple('#ccc', false)}
                onPress={this._handlePress}>
                <View style={styles.getDirections}>
                  <View style={styles.addressContainer}>
                    <Text style={styles.venueAddress}>
                      {event.street}{'\n'}{event.city}
                    </Text>
                  </View>
                  <View style={styles.directionsIcon}>
                    <Image source={Images.directionsIcon} />
                    <Text style={styles.directionsLabel}>Directions</Text>
                  </View>
                </View>
              </Touchable>
              <View style={styles.mapActionsSeparator} />
              {this._renderRideShareButton()}
            </View>
          </View>
          </View>
        </ScrollView>

        <StatusBarUnderlay animatedOpacity={underlayOpacity} />
      </PurpleGradient>
    );
  }

  _renderActionSheet = () => {
    let { event } = this.props;
    const title = event.title;
    const action_message = "Let's go to "+title+"! Shared from";
    const showShareSheet = () => {
      ActionSheetIOS.showShareActionSheetWithOptions(
        {
          url: 'http://evely.co',
          message: action_message,
          subject: 'Evely',
        },
        error => alert(error),
        (success, method) => {
          if (success) {
            alert(`Shared via ${method}`);
          }
        }
      );
    };

    return (
      <SimpleLineIcons onPress={showShareSheet} name="share-alt" size={32} color={Colors.darkPurple} style={{paddingLeft:50,paddingTop:17}} />
    );
  };

  _renderIcon = () => {
    if (this.props.isAttending) {
      return (
        <MaterialIcons
          name="check"
          size={35}
          style={{color:'#fff'}}
        />
      );
    } 
  };

  _renderMainImage = () => {
    let { event } = this.props;

    return (
      <View style={styles.mainImageContainer}>

        <FadeIn
          placeholderStyle={{ backgroundColor: Colors.purple }}
          style={StyleSheet.absoluteFill}>
          <Image
            source={{uri:event.img}}
            style={[styles.mainImage, { width: null, height: null }]}
          />
        </FadeIn>

        <View style={styles.mainHeadingContainer}>
          {this._renderIcon()}
          <Text style={styles.breakHeading}>
            {event.title}
          </Text>
          <Text style={styles.breakDuration}>
            <Text>
              {event.timeframe}
            </Text>
          </Text>
        </View>

      </View>
    );
  };


  _onToggleAttending = () => {
    if (this.props.isAttending) {
      this.props.dispatch(Actions.removeAttendingEvent(this.props.event.title));
    } else {
      this.props.dispatch(Actions.addAttendingEvent(this.props.event.title));
      this._updateFirebase();
    }
    this._renderIcon();
  }

  _updateFirebase = () => {
    firebase.database().ref().child('attendance').child(this.props.event.title).orderByChild('uid').equalTo(this.props.currentUser.id).on('value', (snapshot) => {
      var exists = (snapshot.val() !== null);
      if (!exists) {
        firebase.database().ref().child('attendance').child(this.props.event.title).push({user:this.props.currentUser.name,email:this.props.currentUser.email,uid:this.props.currentUser.id});
      }
    });
  }

  _renderOptions = options => {
    return (
      <View style={styles.descriptionContainer}>
        {options.map(this._renderOption)}
      </View>
    );
  };

  _renderOption = (option, index) => {
    return (
      <Text key={index} style={styles.description}>{`\u2022  ${option}`}</Text>
    );
  };

  maybeClose = () => {
    if (this.state.showRideOptions) {
      this._toggleRides();
      return true;
    } else {
      return false;
    }
  };

  _renderRideShareButton() {
    return (
      <View>
        <Touchable
          background={Touchable.Ripple('#ccc')}
          onPress={this._toggleRides}>
          <View style={styles.getRide}>
            <Text style={styles.getRideLabel}>Need a ride?</Text>
            <MaterialIcons
              name="directions-car"
              size={35}
              style={[
                styles.getRideIcon
              ]}
            />
          </View>
        </Touchable>
      </View>
    );
  }


  _openLyftAsync = () => {
    const lat = `destination[latitude]=${this.props.event.lat}`;
    const lng = `destination[longitude]=${this.props.event.longitude}`;
    const lyft = `lyft://ridetype?${lat}&${lng}`;

    maybeOpenURL(lyft, {
      appName: 'Lyft',
      appStoreId: 'id529379082',
      playStoreId: 'me.lyft.android',
    });
  };

  _openUberAsync = () => {
    const pickup = 'action=setPickup&pickup=my_location';
    const client = `client_id=${UBER_CLIENT_ID}`;
    const lat = `dropoff[latitude]=${this.props.event.lat}`;
    const lng = `dropoff[longitude]=${this.props.event.longitude}`;
    const nick = `dropoff[nickname]=${this.props.event.placeName}`;
    const addr_format = `{this.props.event.street}.replace(" ","%20")`;
    const city_format = `{this.props.event.city}.replace(" ","%20")`;
    const daddr = `dropoff[formatted_address]=addr_format + city_format`;
    const uber = `uber:?${pickup}&${client}&${lat}&${lng}&${nick}&${daddr}`;

    maybeOpenURL(uber, {
      appName: 'Uber',
      appStoreId: 'id368677368',
      playStoreId: 'com.ubercab',
    });
  };

  _toggleRides = () => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Uber', 'Lift', 'Cancel'],
          cancelButtonIndex: 2,
          liftButtonIndex: 1,
          uberButtonIndex: 0,
        },
        buttonIndex => {
          console.log({ buttonIndex });
          if (buttonIndex == 0) {
            this._openUberAsync();
          }
          else if (buttonIndex == 1) {
            this._openLyftAsync();
          }
        }
      );
   };

  _handlePress = () => {
    const addr_format = `{event.street}.replace(" ","+")`;
    const city_format = `{event.city}.replace(" ","+")`;
    const map_addr = addr_format + city_format;
    openExternalMapApp(map_addr);
  };

}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginBottom: 30,
    marginHorizontal: 30,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: -40,
    left: -5,
  },
  buttonContainer: {
    marginTop:15,
    marginBottom:15,
    borderWidth: 1,
    borderColor: Colors.darkPurple,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.transparent,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: Fonts.type.bold,
    fontSize: 11,
    letterSpacing: 0,
    color: Colors.darkPurple,
  },
  buttonGoingContainer: {
    marginBottom:15,
    width:200,
    borderWidth: 1,
    borderColor: Colors.darkPurple,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.darkPurple,
    justifyContent: 'center',
  },
  buttonGoingText: {
    textAlign: 'center',
    fontFamily: Fonts.type.bold,
    fontSize: 11,
    letterSpacing: 0,
    color: Colors.snow,
  },
  card: {
    paddingTop: 20,
    paddingHorizontal: 10,
    borderRadius: Layout.cardRadius,
    backgroundColor: Colors.snow,
  },
  mainImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: Colors.transparent,
  },
  mainImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  mainHeadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  breakHeading: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 23,
    letterSpacing: -0.2,
    lineHeight: 27,
    color: Colors.snow,
  },
  breakDuration: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    letterSpacing: -0.19,
    color: Colors.snow,
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 10,
  },
  heading: {
    marginBottom: 5,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 17,
    letterSpacing: 0,
    color: Colors.darkPurple,
  },
  descriptionContainer: {
    marginBottom: 15,
    paddingLeft: 5,
  },
  description: {
    fontFamily: 'Montserrat-Light',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
    color: Colors.lightText,
  },
  mapActions: {
    backgroundColor: Colors.snow,
    borderTopWidth: 1,
    borderTopColor: '#C4C4C4',
    borderBottomWidth: 1,
    borderBottomColor: '#DEDEDE',
    shadowColor: Colors.black,
    shadowRadius: 3,
    shadowOffset: {
      x: 10,
      y: 10,
    },
    shadowOpacity: 0.3,
    zIndex: 1,
  },
  mapActionsSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#DEDEDE',
  },
  getDirections: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  venueAddress: {
    fontFamily: 'Montserrat-Light',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.lightText,
  },
  addressContainer: {
    flex: 4,
  },
  directionsIcon: {
    alignItems: 'center',
  },
  directionsLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0,
    color: Colors.lightText,
  },
  getRide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  getRideLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0.5,
    color: Colors.darkPurple,
  },
  getRideIcon: {
    marginRight: 15,
  },
});
