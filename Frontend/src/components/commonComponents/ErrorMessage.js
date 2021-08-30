import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ErrorMessage = ({errorValue}) => <Text style={styles.errorText}>{errorValue}</Text>;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ErrorMessage;
