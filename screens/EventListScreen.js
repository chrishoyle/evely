import React from 'react';
import { ActivityIndicator, Animated, Platform, FlatList, StyleSheet, View } from 'react-native';
import { TabViewAnimated, TabViewPagerScroll } from 'react-native-tab-view';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import PurpleGradient from '../components/PurpleGradient';
import DayToggle from '../components/DayToggle';
import EventCard from '../components/EventCard';
import NavigationEvents from '../utilities/NavigationEvents';
import * as firebase from 'firebase';


export default class EventListScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  state = {
    index: 0,
    routes: [{ key: 'friday', day: 0 },{ key: 'saturday', day: 1 }, { key: 'sunday', day: 2 }],
    loading: false,
    eventByDay: {},
  };

  _eventDayRef = {};

  componentWillMount() {
    let initialLoad = true;
    this.setState({loading: true});

    this._tabPressedListener = NavigationEvents.addListener(
      'selectedTabPressed',
      route => {
        if (route.key === 'event') {
          this._scrollToTop();
        }
      }
    );

    firebase.database().ref('events').on('value', (snapshot) => {
      this.setState({eventByDay: snapshot.val()});
      if (initialLoad) {
        this.setState({loading: false});
        initialLoad = false;
      }
    });
  }

  componentWillUnmount() {
    this._tabPressedListener.remove();
  }

  _scrollToTop = () => {
    let eventDay = this._eventDayRef[this.state.index];
    eventDay && eventDay.scrollToTop();
  };

  render() {
    return (
      <PurpleGradient style={styles.container}>
        <TabViewAnimated
          style={{ flex: 1 }}
          lazy={true}
          renderPager={props => <TabViewPagerScroll {...props} />}
          navigationState={this.state}
          renderScene={this._renderPage}
          renderHeader={this._renderHeader}
          onRequestChangeTab={this._handleChangeTab}
          initialLayout={{
            width: Layout.window.width,
            height:
              Layout.window.height -
              Layout.tabBarHeight -
              Layout.dayToggleHeight,
          }}
        />
      </PurpleGradient>
    );
  }

  _handlePressTab = index => {
    // Scroll to the top if you double tap it
    if (this.state.index === index) {
      this._scrollToTop();
      return;
    }
    //console.log(this.state.eventByDay);

    this._handleChangeTab(index);
  };

  _handleChangeTab = index => {
    if (Platform.OS === 'ios') {
      this.setState({ index });
    }
    if (this._tabChangeTimer) {
      return;
    }

    this.setState({ index });
    this._tabChangeTimer = setTimeout(() => {
      this._tabChangeTimer = null;
    }, 300);
  };

  _renderHeader = props => {
    return (
      <DayToggle position={props.position} onPressDay={this._handlePressTab} />
    );
  };

  _renderPage = ({ route }) => {
    const { day } = route;

    return (
      <EventDay
        ref={view => {
          this._eventDayRef[day] = view;
        }}
        events={this.state.eventByDay[day]}
        fadeInOnRender={day === 1}
      />
    );
  };
}

class EventDay extends React.PureComponent {
  constructor(props) {
    super();

    this.state = {
      visible: new Animated.Value(props.fadeInOnRender ? 0 : 1),
      waitingToRender: !!props.fadeInOnRender,
    };
  }

  componentWillMount() {
    if (this.props.fadeInOnRender) {
      requestAnimationFrame(() => {
        this.setState({ waitingToRender: false }, () => {
          Animated.timing(this.state.visible, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      });
    }
  }

  render() {
    if (this.state.waitingToRender) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }

    return (
      <Animated.View
        style={{
          flex: 1,
          opacity: this.state.visible,
          backgroundColor: 'transparent',
        }}>
        <FlatList
          data={this.props.events}
          ref={view => {
            this._list = view;
          }}
          renderItem={this._renderItem}
          keyExtractor={item => item.title}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    );
  }

  scrollToTop = () => {
    this._list.scrollToOffset({ x: 0, y: 0 });
  };

  _renderItem = ({ item }) => {
    if (item.visible === 'true'){
      return <EventCard event={item} />;
    } else{
      return;
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width: Layout.window.width,
  },
  row: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginVertical: Layout.smallMargin,
  },
  boldLabel: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  label: {
    color: Colors.text,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 20,
  },
  timeline: {
    width: 2,
    backgroundColor: '#6E3C7B',
    position: 'absolute',
    top: 85,
    bottom: 0,
    right: 11,
  },
});
