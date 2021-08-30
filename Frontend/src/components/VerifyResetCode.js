import React, {Component} from 'react';
import {StyleSheet, View, Keyboard, TouchableNativeFeedback} from 'react-native';
import {Input, Button} from 'react-native-elements';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import KeyboardScrollView from './commonComponents/KeyboardScrollView';
import ErrorMessage from './commonComponents/ErrorMessage';

const validationSchema = Yup.object().shape({
  resetCode: Yup.number()
    .label('Reset Code')
    .integer('Please enter a valid number.')
    .positive('Please enter a valid number.')
    .min(100000, 'Number should be 6 digits long.')
    .max(999999, 'Number should be 6 digits long.')
    .typeError('Please enter a valid number.')
    .required('Please enter a valid number.'),
});

export default class VerifyResetCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitErrorMessage: '',
    };
  }

  verifyResetCode = async (params, resetForm) => {
    console.log(params);
    try {
      const response = await axios.post('http://192.168.0.104:5000/auth/verifyResetCode', params);
      console.log(JSON.stringify(response.data, null, 2));
      resetForm({});
      this.setState({submitErrorMessage: ''});
      this.props.navigation.navigate('Change Password', {emailId: params.emailId});
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        this.setState({submitErrorMessage: error.response.data});
        console.log(JSON.stringify(error.response.data, null, 2));
        console.log(JSON.stringify(error.response.status, null, 2));
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

  handleSubmit = async (resetCode, resetForm) => {
    const {emailId} = this.props.route.params;
    Keyboard.dismiss();
    await this.verifyResetCode({emailId, resetCode}, resetForm);
  };

  render() {
    return (
      <KeyboardScrollView>
        <View style={styles.container}>
          <Formik
            initialValues={{resetCode: ''}}
            onSubmit={async (values, actions) => {
              await this.handleSubmit(parseInt(values.resetCode, 10), actions.resetForm);
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
                <OTPInputView
                  style={{width: '80%', height: 50}}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  code={values.resetCode}
                  onCodeChanged={handleChange('resetCode')}
                  onCodeFilled={() => validateForm()}
                />

                <ErrorMessage errorValue={errors.resetCode} />

                <Button
                  containerStyle={{overflow: 'hidden'}}
                  buttonStyle={{borderRadius: 20, width: 300, height: 50}}
                  titleStyle={{fontSize: 22, fontWeight: 'bold'}}
                  loadingProps={{size: 'large'}}
                  title="VERIFY CODE"
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

          {/* <Input
            containerStyle={styles.containerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={{color: '#1E88E5'}}
            leftIcon={{
              name: 'key-outline',
              type: 'material-community',
              size: 24,
              color: 'gray',
            }}
            leftIconContainerStyle={{marginLeft: 0}}
            autoCompleteType="off"
            label="Reset Code"
            placeholder="123456"
            keyboardType="numeric"
            errorMessage={this.state.errorMessage}
            blurOnSubmit={false}
            onChangeText={(resetCode) => {
              this.setState({resetCode: parseInt(resetCode, 10)}, () => this.checkResetCode());
            }}
          /> */}
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
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    fontSize: 16,
    color: 'green',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
