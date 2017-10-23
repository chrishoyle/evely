import React from 'react';
import {
  Animated,
  LayoutAnimation,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { WebBrowser } from 'expo';

import { Colors, Fonts, Layout } from '../constants';
import { TwitterBanner } from '../components/InfoBanners';
import RoundedButton from '../components/RoundedButton';
import PurpleGradient from '../components/PurpleGradient';
import StatusBarUnderlay from '../components/StatusBarUnderlay';
import NavigationEvents from '../utilities/NavigationEvents';


export default class GeneralInfoScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  };

  state = {
    scrollY: new Animated.Value(0),
  };

  componentWillMount() {
    this._tabPressedListener = NavigationEvents.addListener(
      'selectedTabPressed',
      route => {
        if (route.key === 'GeneralInfo') {
          this._scrollToTop();
        }
      }
    );
  }

  componentWillUnmount() {
    this._tabPressedListener.remove();
  }

  render() {
    let underlayOpacity = this.state.scrollY.interpolate({
      inputRange: [100, 250],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <PurpleGradient style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <TwitterBanner />
            <View style={styles.liveHelp}>
              <RoundedButton
                text="Send us a Text"
                onPress={() => Linking.openURL('sms:7033385999')}
                style={styles.liveHelpButton}
              />
              <RoundedButton
                text="Tweet at us"
                onPress={this._tweetWithHashtag}
                style={styles.liveHelpButton}
              />
            </View>
          </View>

        </ScrollView>

        <StatusBarUnderlay animatedOpacity={underlayOpacity} />
      </PurpleGradient>
    );
  }

  _scrollToTop = () => {
    this._scrollView.getNode().scrollTo({ x: 0, y: 0 });
  };

  _tweetWithHashtag = async () => {
    const appURL = 'twitter://post?hashtags=WelcomeWeekend';
    const webURL = 'https://twitter.com/intent/tweet?hashtags=WelcomeWeekend';
    try {
      await Linking.openURL(appURL);
    } catch (err) {
      WebBrowser.openBrowserAsync(webURL);
    }
  };


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  liveHelp: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Layout.doubleBaseMargin,
  },
  liveHelpButton: {
    marginTop: 25,
    width: 200,
  },
});
