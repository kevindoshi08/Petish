import React, {Component} from 'react';
import {StyleSheet, View, Keyboard, TouchableNativeFeedback} from 'react-native';
import {Input, Button} from 'react-native-elements';
import axios from 'axios';
import {Formik} from 'formik';
import * as Yup from 'yup';

import KeyboardScrollView from './commonComponents/KeyboardScrollView';
import ErrorMessage from './commonComponents/ErrorMessage';

const validationSchema = Yup.object().shape({
  emailId: Yup.string()
    .label('Email ID')
    .email('Enter a valid email ID.')
    .required('Email ID cannot be blank.'),
});

export default class SendResetCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitErrorMessage: '',
    };
  }

  sendResetCode = async (emailId) => {
    try {
      const response = await axios.post('http://192.168.0.104:5000/auth/sendResetCode', {
        emailId,
      });
      console.log(JSON.stringify(response.data, null, 2));
      this.setState({submitErrorMessage: ''});
      this.props.navigation.navigate('Verify Reset Code', {emailId});
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

  handleSubmit = async (emailId) => {
    Keyboard.dismiss();
    await this.sendResetCode(emailId);
  };

  render() {
    return (
      <KeyboardScrollView>
        <View style={styles.container}>
          <Formik
            initialValues={{emailId: ''}}
            onSubmit={async (values) => {
              await this.handleSubmit(values.emailId);
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
                  label="Email ID"
                  name="emailId"
                  value={values.emailId}
                  placeholder="abc@xyz.com"
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  onBlur={handleBlur('emailId')}
                  onChangeText={handleChange('emailId')}
                />
                <ErrorMessage errorValue={touched.emailId && errors.emailId} />

                <Button
                  containerStyle={{overflow: 'hidden'}}
                  buttonStyle={{borderRadius: 20, width: 300, height: 50}}
                  titleStyle={{fontSize: 22, fontWeight: 'bold'}}
                  loadingProps={{size: 'large'}}
                  title="SEND RESET CODE"
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
