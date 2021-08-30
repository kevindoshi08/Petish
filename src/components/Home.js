/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

export default class Home extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text> Welcome to your Home Screen!! </Text>
        <Button
          title="Clcik here to go to Login Screen"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    );
  }
}
