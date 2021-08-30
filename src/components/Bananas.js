/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {TouchableNativeFeedback, Text, StyleSheet, View} from 'react-native';

class CalcButton extends Component {
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

export default class Bananas extends Component {
  constructor(props) {
    super(props);
    this.state = {number: 999};
  }

  changeDisplayHandler = numPressed => {
    this.setState({number: numPressed});
  };

  render() {
    let num_arr = [[7, 8, 9], [4, 5, 6], [1, 2, 3], [0, '.', '=']];
    let rows = [];
    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(
          <CalcButton
            changeDisplayHandler={this.changeDisplayHandler}
            text={num_arr[i][j]}
          />,
        );
      }
      rows.push(<View style={styles.row}>{row}</View>);
    }

    let op_arr = ['DEL', '/', 'x', '-', '+'];
    let ops = [];
    for (let i = 0; i < 5; i++) {
      ops.push(<CalcButton text={op_arr[i]} />);
    }

    return (
      // Main container
      <View style={styles.container}>
        <View style={styles.calculation}>
          <Text style={styles.calculationText}>
            {this.state.number} 11 * 11
          </Text>
        </View>
        <View style={styles.result}>
          <Text style={styles.resultText}>{this.state.number} 121</Text>
        </View>
        <View style={styles.buttons}>
          <View style={styles.numbers}>{rows}</View>
          <View style={styles.operations}>
            <View style={styles.col}>{ops}</View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  calculation: {
    flex: 2,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  calculationText: {color: 'white', fontSize: 35},
  result: {
    flex: 1,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  resultText: {color: 'white', fontSize: 25},
  buttons: {alignItems: 'stretch', flex: 6, flexDirection: 'row'},
  numbers: {flex: 3},
  row: {flex: 1, flexDirection: 'row'},
  operations: {flex: 1},
  col: {
    flex: 1,
    flexDirection: 'column',
  },

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
