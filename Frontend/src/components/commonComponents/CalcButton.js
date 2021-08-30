import React, {Component} from 'react';
import {TouchableNativeFeedback, View, Text, StyleSheet} from 'react-native';

export default class CalcButton extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    var changeDisplayHandler = this.props.changeDisplayHandler;
    return (
      <TouchableNativeFeedback
        onPress={() => {
          changeDisplayHandler(this.props.text);
        }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{this.props.text}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
  },
});
