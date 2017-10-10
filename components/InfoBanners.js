import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient, WebBrowser } from 'expo';

import { Colors, Fonts, Images } from '../constants';
import RoundedButton from './RoundedButton';


export class TwitterBanner extends React.PureComponent {
  render() {
    return (
      <View style={twitterStyles.container}>
        <TouchableOpacity onPress={this._tweetWithHashtag}>
          <Text style={twitterStyles.heading}>Welcome to Evely! 🙌</Text>
        </TouchableOpacity>
        <Text style={twitterStyles.description}>
          Let us help you make the most of your weekends!&nbsp;
          <Text style={twitterStyles.hashtag} onPress={this._tweetWithHashtag}>
           
          </Text>.
        </Text>
      </View>
    );
  }

  _tweetWithHashtag = async () => {
    const appURL = 'twitter://post?hashtags=Evely';
    const webURL = 'https://twitter.com/intent/tweet?hashtags=Evely';
    try {
      await Linking.openURL(appURL);
    } catch (err) {
      WebBrowser.openBrowserAsync(webURL);
    }
  };
}

const twitterStyles = StyleSheet.create({
  heading: {
    marginTop: 70,
    fontFamily: Fonts.type.bold,
    fontSize: 31,
    letterSpacing: 0.2,
    backgroundColor: Colors.transparent,
    color: Colors.snow,
  },
  description: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    color: Colors.snow,
    letterSpacing: 0.47,
    lineHeight: 23,
  },
  hashtag: {
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.snow,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
    paddingVertical: 30,
    backgroundColor: Colors.transparent,
  },
});
