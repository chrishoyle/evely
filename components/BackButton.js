import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

import Colors from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';


@withNavigation
export default class BackButton extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={[styles.backButton, this.props.style]}
        hitSlop={{ top: 40, left: 40, right: 30, bottom: 30 }}
        onPress={this.props.onPress || this._goBack}>

        <MaterialIcons name="arrow-back" size={22} color={Colors.snow} style={{backgroundColor: Colors.transparent}}/>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    );
  }

  _goBack = () => {
    this.props.navigation.goBack();
  };
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    marginRight: 5,
  },
  backButtonText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 17,
    letterSpacing: 0,
    backgroundColor: Colors.transparent,
    color: Colors.snow,
  },
});
