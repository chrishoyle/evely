import React from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { withNavigation } from '@expo/ex-navigation';
import FadeIn from 'react-native-fade-in-image';
import Touchable from 'react-native-platform-touchable';
import { MaterialIcons,SimpleLineIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import Fonts from '../constants/Fonts';
import Images from '../constants/Images';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';


@withNavigation
@connect((data, props) => EventCard.getDataProps(data, props))
export default class EventCard extends React.PureComponent {
  static getDataProps(data, props) {
    let { eventId } = props;
    let isAttending = data.events.attending.includes(eventId);
    return {
      isAttending,
    }
  }
  render() {
    let { event, isAttending } = this.props;
    const containerStyles = [styles.container];

    return (
      <View style={containerStyles}>
        <Touchable
          foreground={Touchable.Ripple('#dadada', true)}
          fallback={TouchableWithoutFeedback}
          onPress={() => this._handlePressCard(event) }>
          <View>
            <FadeIn
              placeholderStyle={{ backgroundColor: Colors.purple }}
              style={StyleSheet.absoluteFill}>
              <Image
                source={{uri:event.img}}
                style={[styles.background, { width: null, height: null }]}
              />
            </FadeIn>
            <View style={styles.cardContentContainer}>
              <View style={styles.contentContainer}>
                <View style={styles.content}>
                  <Text style={styles.heading}>
                    {event.title}
                  </Text>
                  <Text style={styles.duration}>
                    {event.timeframe}
                  </Text>
                </View>
              </View>
              {this._renderIcon()}
            </View>
          </View>
        </Touchable>
      </View>
    );
  }

  _renderIcon = () => {
    if (this.props.isAttending) {
      return (
        <MaterialIcons
          name="check"
          size={35}
          style={{color:'#fff',alignSelf: 'flex-end', }}
        />
        );
      }
  };

  _handlePressCard = (event) => {
    console.log(event.title);
    this.props.navigator.push('eventdetail', {
      event: event
    });
  };
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
  cardContentContainer: {
    height: Layout.breakHeight,
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  currentDay: {
    marginLeft: 16,
    marginRight: 24,
  },
  active: {
    marginLeft: 6,
    marginRight: 34,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 5,
    shadowColor: Colors.redShadow,
    shadowOpacity: 1,
  },
  background: {
    resizeMode: 'cover',
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    justifyContent: 'center',
    marginLeft: 15,
  },
  heading: {
    fontFamily: Fonts.type.semiBold,
    fontSize: 18,
    letterSpacing: -0.2,
    lineHeight: 27,
    backgroundColor: Colors.transparent,
    color: Colors.snow,
  },
  duration: {
    fontFamily: Fonts.type.semiBold,
    fontSize: 16,
    letterSpacing: -0.19,
    backgroundColor: Colors.transparent,
    color: Colors.snow,
  },
});
