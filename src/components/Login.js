/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button, Text} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: '',
  };

  checkEmail() {
    if (this.state.email === 'admin') {
      this.setState({errorMessage: ''});
    } else {
      this.setState({errorMessage: 'Invalid Email'});
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Input
            containerStyle={styles.containerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={{color: '#1E88E5'}}
            leftIcon={{
              name: 'email-outline',
              type: 'material-community',
              color: 'gray',
            }}
            leftIconContainerStyle={{marginLeft: 0}}
            autoCompleteType="email"
            returnKeyType={'next'}
            label="Email Address"
            placeholder="abc@xyz.com"
            errorMessage={this.state.errorMessage}
            blurOnSubmit={false}
            onChangeText={email => {
              this.setState({email: email}, () => this.checkEmail());
            }}
            onSubmitEditing={() => {
              this.nextTextInput.focus();
            }}
          />
          <Input
            containerStyle={styles.containerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={{color: '#1E88E5'}}
            ref={input => {
              this.nextTextInput = input;
            }}
            leftIcon={{
              name: 'key-outline',
              type: 'material-community',
              color: 'gray',
            }}
            leftIconContainerStyle={{marginLeft: 0}}
            label="Password"
            placeholder="xxxxxx"
            secureTextEntry
          />
          <Button
            containerStyle={styles.containerStyle}
            title="Login"
            onPress={() => this.props.navigation.navigate('Home')}
          />
          <Button type="clear" title=" New to Petish? Sign Up" />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    backgroundColor: 'white',
  },
  containerStyle: {
    width: 300,
    padding: 20,
  },
  inputStyle: {
    fontSize: 16,
  },
});
