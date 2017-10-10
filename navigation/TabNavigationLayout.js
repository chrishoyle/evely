import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@expo/ex-navigation';
import { SimpleLineIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import Router from './Router';

const defaultRouteConfig = {
  navigationBar: {
    titleStyle: {fontFamily: 'OpenSans-Bold'},
    backgroundColor: '#fff',
  },
};

export default class TabNavigationLayout extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    }
  }

  render() {
    return (
      <TabNavigation
        tabBarColor={Colors.tabBar}
        tabBarHeight={48}
        initialTab="eventList">

        <TabNavigationItem
          id="eventList"
          renderIcon={isSelected => this._renderIcon('calendar', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('eventList')}
          />
        </TabNavigationItem>

        <TabNavigationItem
          id="setting"
          renderIcon={isSelected => this._renderIcon('settings', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('setting')}
          />
        </TabNavigationItem>

        <TabNavigationItem
          id="generalinfo"
          renderIcon={isSelected => this._renderIcon('options', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('generalinfo')}
          />
        </TabNavigationItem>
      </TabNavigation>
    );
  }

  _renderIcon(iconName, isSelected) {
    let color = isSelected ? Colors.tabIconSelected : Colors.tabIconDefault;

    return (
      <View style={styles.tabItemContainer}>
        <SimpleLineIcons name={iconName} size={32} color={color} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});