import React, {Component} from 'react';
import {View, StyleSheet, Keyboard, TouchableNativeFeedback} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import PropTypes from 'prop-types';

import KeyboardScrollView from './commonComponents/KeyboardScrollView';
import ErrorMessage from './commonComponents/ErrorMessage';

const validationSchema = Yup.object().shape({
  emailId: Yup.string()
    .label('Email ID')
    .email('Enter a valid email ID.')
    .required('Email ID cannot be blank.'),
  password: Yup.string()
    .label('Password')
    .min(8, 'Password must have at least 8 characters.')
    .required('Password cannot be blank.'),
});

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitErrorMessage: '',
    };
  }

  login = async (user, resetForm) => {
    try {
      const response = await axios.post('http://192.168.0.104:5000/auth/login', user);
      console.log(JSON.stringify(response, null, 2));
      this.storeToken(response.headers.authorization.replace('Bearer ', ''));
      // Do something with response
      resetForm({});
      this.setState({submitErrorMessage: ''});
      this.props.navigation.navigate('Home');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        this.setState({submitErrorMessage: error.response.data});
        // console.log(JSON.stringify(error.response.status, null, 2));
        // console.log(JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        // The request was made but no response was received
        console.log(JSON.stringify(error.request, null, 2));
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', JSON.stringify(error.message, null, 2));
      }
      // console.log(JSON.stringify(error.config, null, 2));
    }
  };

  storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('AUTHORIZATION_TOKEN', token);
    } catch (e) {
      console.log('Error in saving token');
    }
  };

  handleForgotPassword = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('Send Reset Code');
  };

  handleSubmit = async (values, resetForm) => {
    Keyboard.dismiss();
    const user = {emailId: values.emailId, password: values.password};
    await this.login(user, resetForm);
  };

  handleSignup = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('Signup');
  };

  render() {
    return (
      <KeyboardScrollView>
        <View style={styles.container}>
          <Formik
            initialValues={{emailId: '', password: ''}}
            onSubmit={async (values, actions) => {
              await this.handleSubmit(values, actions.resetForm);
            }}
            validationSchema={validationSchema}>
            {({
              handleChange,
              values,
              handleSubmit,
              errors,
              isValid,
              isSubmitting,
              touched,
              handleBlur,
              dirty,
            }) => (
              <>
                <Input
                  containerStyle={styles.containerStyle}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  leftIcon={{
                    name: 'email-outline',
                    type: 'material-community',
                    size: 24,
                    color: 'gray',
                  }}
                  leftIconContainerStyle={{marginLeft: 0}}
                  autoCompleteType="email"
                  returnKeyType="next"
                  label="Email ID"
                  value={values.emailId}
                  placeholder="abc@xyz.com"
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  onBlur={handleBlur('emailId')}
                  onChangeText={handleChange('emailId')}
                  onSubmitEditing={() => {
                    this.nextTextInput.focus();
                  }}
                />
                <ErrorMessage errorValue={touched.emailId && errors.emailId} />
                <Input
                  containerStyle={styles.containerStyle}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  ref={(input) => {
                    this.nextTextInput = input;
                  }}
                  leftIcon={{
                    name: 'textbox-password',
                    type: 'material-community',
                    color: 'gray',
                  }}
                  leftIconContainerStyle={{marginLeft: 0}}
                  label="Password"
                  value={values.password}
                  placeholder="••••••••"
                  secureTextEntry
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                />
                <ErrorMessage errorValue={touched.password && errors.password} />
                <Button
                  type="clear"
                  titleStyle={{fontSize: 18}}
                  title="Forgot Password?"
                  onPress={this.handleForgotPassword}
                />
                <Button
                  containerStyle={{overflow: 'hidden'}}
                  buttonStyle={{borderRadius: 20, width: 200, height: 50}}
                  titleStyle={{fontSize: 22, fontWeight: 'bold'}}
                  loadingProps={{size: 'large'}}
                  title="LOGIN"
                  raised
                  useForeground
                  background={TouchableNativeFeedback.Ripple('#AAF', true)}
                  onPress={handleSubmit}
                  disabled={isSubmitting || !isValid || !dirty}
                  loading={isSubmitting}
                />
                <ErrorMessage errorValue={this.state.submitErrorMessage} />
              </>
            )}
          </Formik>
          <Button
            type="outline"
            titleStyle={{fontSize: 20}}
            title="New to Petish? Sign Up"
            onPress={this.handleSignup}
          />
        </View>
      </KeyboardScrollView>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
    backgroundColor: 'white',
  },
  containerStyle: {
    width: 300,
    padding: 10,
    overflow: 'hidden',
    borderRadius: 20,
  },
  inputStyle: {
    fontSize: 16,
  },
  labelStyle: {color: '#1E88E5', fontSize: 20},
});
