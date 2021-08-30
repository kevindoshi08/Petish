import React, {Component} from 'react';
import {StyleSheet, View, Keyboard, TouchableNativeFeedback} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import KeyboardScrollView from './commonComponents/KeyboardScrollView';
import ErrorMessage from './commonComponents/ErrorMessage';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .label('Password')
    .min(8, 'Password must have at least 8 characters.')
    .required('Please enter a value.'),
  cnfPassword: Yup.string()
    .label('Confirm Password')
    .oneOf([Yup.ref('password')], "Passwords don't match.")
    .required('Please enter a value.'),
});

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitErrorMessage: '',
    };
  }

  changePassword = async (params, resetForm) => {
    const {emailId, password} = this.state;
    try {
      const response = await axios.post('http://192.168.0.104:5000/auth/changePassword', params);
      console.log(JSON.stringify(response.data, null, 2));
      resetForm({});
      this.setState({submitErrorMessage: ''});
      this.props.navigation.navigate('Home');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        this.setState({submitErrorMessage: error.response.data});
        console.log(JSON.stringify(error.response.data, null, 2));
        console.log(JSON.stringify(error.response.status, null, 2));
        console.log(JSON.stringify(error.response.headers, null, 2));
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

  handleSubmit = async (password, resetForm) => {
    const {emailId} = this.props.route.params;
    Keyboard.dismiss();
    await this.changePassword({emailId, password}, resetForm);
  };

  render() {
    return (
      <KeyboardScrollView>
        <View style={styles.container}>
          <Formik
            initialValues={{password: '', cnfPassword: ''}}
            onSubmit={async (values, actions) => {
              await this.handleSubmit(values.password, actions.resetForm);
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
              validateForm,
            }) => (
              <>
                <Input
                  containerStyle={styles.containerStyle}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  leftIcon={{
                    name: 'textbox-password',
                    type: 'material-community',
                    color: 'gray',
                  }}
                  leftIconContainerStyle={{marginLeft: 0}}
                  name="password"
                  label="Password"
                  value={values.password}
                  placeholder="••••••••"
                  secureTextEntry
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                  onSubmitEditing={() => {
                    this.nextTextInput.focus();
                  }}
                />
                <ErrorMessage errorValue={touched.password && errors.password} />
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
                  name="cnfPassword"
                  label="Confirm Password"
                  value={values.cnfPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  onBlur={handleBlur('cnfPassword')}
                  onChangeText={handleChange('cnfPassword')}
                />
                <ErrorMessage errorValue={touched.cnfPassword && errors.cnfPassword} />

                <Button
                  containerStyle={{overflow: 'hidden'}}
                  buttonStyle={{borderRadius: 20, width: 280, height: 50}}
                  titleStyle={{fontSize: 22, fontWeight: 'bold'}}
                  title="CHANGE PASSWORD"
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
        </View>
      </KeyboardScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  containerStyle: {
    width: 300,
    padding: 20,
  },
  inputStyle: {
    fontSize: 16,
  },
  labelStyle: {color: '#1E88E5', fontSize: 20},
});
