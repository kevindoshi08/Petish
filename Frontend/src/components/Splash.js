import React, {Component} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';

export default class Splash extends Component {
  render() {
    return (
      <View>
        <Text> WELCOME TO PETISH Splash!! </Text>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }
}
