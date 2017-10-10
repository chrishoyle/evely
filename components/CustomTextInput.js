import React, { Component } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import * as firebase from 'firebase';

export default class CustomTextInput extends React.Component {
  constructor(prop) {
    super(prop);
    let props_obj = {...this.props};
    var firebase_user = firebase.auth().currentUser;

    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEndEditing = this.onEndEditing.bind(this);
    this.state = {
      hasFocus: false,
      value: props_obj.name,
      type: props_obj.type,
      user: firebase_user
    }
  }

  onFocus() {
    this.setState({hasFocus: true});
    this.inputFocused.bind(this, this.state.type);
  }

  onChange(event) {
    this.setState({value: event.nativeEvent.text});
  }

  onEndEditing(event) {
    this.setState({hasFocus: false, value: event.nativeEvent.text});
    if (this.state.type == 'email') {
      this.updateEmail(event.nativeEvent.text);
      this.sendVerificationEmail();
    } else {
      this.updateName(event.nativeEvent.text);
    }
  }

  updateEmail(email){
    //user = this.state.user;
    var user = firebase.auth().currentUser;
    console.log("user = "+ user.uid);
    firebase.database().ref().child('users').child(user.uid).once('value')
      .then(function (userRecord) {
      //if(userRecord.exists()) {
      userRecord.ref.child('email').set(email);
      //} 
    });
  }

  sendVerificationEmail(){
    this.state.user.sendEmailVerification().then(function() {
      console.log("Verification email sent");
    }).catch(function(error) {
      console.log("error" + error);
    });
  }

  updateName(display_name){
    this.state.user.updateProfile({
      displayName: display_name,
    }).then(function() {
      console.log("Display name has been updated");
    }).catch(function(error) {
      console.log("error" + error);
    });
  }

  inputFocused (refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        110, //additionalOffset
        true
      );
    }, 50);
  }

  render() {
    const textStyles = [
      styles.text,
      this.state.hasFocus ? styles.focused : undefined
    ];
    return (
      <TextInput
        value={this.state.value}
        ref={this.state.value}
        style={textStyles}
        editable={true}
        onFocus={this.onFocus}
        onChange={this.onChange}
        onEndEditing={this.onEndEditing}/>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    height: 30,
    color:'#FFF',
    flex:2
  },

  focused: {
    borderColor: '#00AA00'
  }
});
