import React from 'react';
import {
  Animated,
  BackHandler,
  View,
  Platform,
  Text,
  StyleSheet,
  PanResponder,
  LayoutAnimation,
  Switch,
  ScrollView,
  TextInput,
} from 'react-native';
import { Provider as ReduxProvider, connect } from 'react-redux';
import { Colors, Fonts, Images, Layout } from '../constants';
import NavigationEvents from '../utilities/NavigationEvents';
import StatusBarUnderlay from '../components/StatusBarUnderlay';
import PurpleGradient from '../components/PurpleGradient';
import CustomTextInput from '../components/CustomTextInput';

@connect(data => EditScreen.getDataProps)
export default class EditScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false, 
    },
  }

  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEndEditing = this.onEndEditing.bind(this);
    this.state = {
      hasFocus: false,
      value: 'Existing'
    }
  }

  onFocus() {
    this.setState({hasFocus: true});
  }

  onChange(event) {
    this.setState({value: event.nativeEvent.text});
  }

  onEndEditing(event) {
    this.setState({hasFocus: false, value: event.nativeEvent.text});
  }

  state = {
    switchValue: false
  };

  componentWillMount() {

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('backPress', this._handleBackButtonPress);
    }

  }

  componentWillUnmount() {
    this._navigationEventListener && this._navigationEventListener.remove();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._handleBackButtonPress
    );
  }

  static getDataProps(data) {
    return {
      currentUser: data.currentUser,
    }
  }

  render() {

    return (
      <PurpleGradient style={[styles.linearGradient, { flex: 1 }]}>
        <ScrollView>
          <View style={styles.container}>
            
            <View style={styles.flex}>
              <Text style={styles.title}>My Account</Text>
              <View
                  style={{
                    borderBottomColor: Colors.snow,
                    borderBottomWidth: 1,
                    width:120,
                    top:60,
                    left:40,
                  }}
                />
            </View>
            <View style={styles.section}>
              <CustomTextInput name={this.props.currentUser.name}/>
              <CustomTextInput name={this._getEmail()}/>
              <Text style={styles.desc}>Washington, D.C.</Text>
              
            </View>
            

          </View>
        </ScrollView>

      </PurpleGradient>
    );
  }

  _getEmail = () => {
    if (this.props.currentUser.email === undefined){
      console.log("It was undefined");
      this.props.currentUser.email = 'Email';
    }
    else {
      console.log("This was defined");
    };
    return this.props.currentUser.emai;
  };

  _scrollToTop = () => {
    this._scrollView && this._scrollView.getNode().scrollTo({ x: 0, y: 0 });
  };


}

const styles = StyleSheet.create({
  titleContainer:{
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  mainContainer: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: Colors.transparent,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  title: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 17,
    color: Colors.snow,
    letterSpacing: 0.47,
    left:20,
    top:50,
  },
  descr: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    color: Colors.snow,
    letterSpacing: 0.47,
    left:20,
  },
  details:{
    fontFamily: 'Montserrat-Medium',
    fontSize: 10,
    color: Colors.snow,
    letterSpacing: 0.47,
    left:20,
    width:160,
    paddingTop:10,
  },
  container: {
    flex: 1,
    paddingTop:0,
    backgroundColor: Colors.transparent,
  },
  flex:{
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  section: {
    marginTop: 30,
    paddingTop: 30,
  },
  switch: {
     marginVertical: 14,
     left:50,
  },
  sectionHeader: {
    padding: Layout.baseMargin,
    backgroundColor: Colors.frost,
  },
  sectionText: {
    ...Fonts.style.normal,
    paddingVertical: Layout.doubleBaseMargin,
    color: Colors.snow,
    marginVertical: Layout.smallMargin,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.snow,
    padding: Layout.smallMargin,
    marginBottom: Layout.smallMargin,
    marginHorizontal: Layout.smallMargin,
  },
  titleText: {
    ...Fonts.style.h2,
    fontSize: 14,
    color: Colors.text,
  },
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  mainHeading: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 31,
    letterSpacing: 0.2,
    color: Colors.snow,
  },
});
