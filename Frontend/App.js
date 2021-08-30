import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import KeepAwake from 'react-native-keep-awake';
import AsyncStorage from '@react-native-community/async-storage';
import JwtDecode from 'jwt-decode';

import Splash from './src/components/Splash';
import Home from './src/components/Home';
import Login from './src/components/Login';
import Signup from './src/components/Signup';
import SendResetCode from './src/components/SendResetCode';
import VerifyResetCode from './src/components/VerifyResetCode';
import ChangePassword from './src/components/ChangePassword';

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isTokenValid: null,
    };
  }

  componentDidMount = async () => {
    await this.checkToken();
  };

  getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('AUTHORIZATION_TOKEN');
      return token;
    } catch (e) {
      console.log('Error in getting token');
    }
  };

  checkToken = async () => {
    const token = await this.getToken();
    if (token === null) {
      console.log('Token is missing!');
      this.setState({isTokenValid: false});
    } else {
      const jwt = JwtDecode(token);
      const now = Date.now().valueOf() / 1000;
      if (now > jwt.exp) {
        console.log('Token is invalid');
        this.setState({isTokenValid: false});
      } else {
        this.setState({isTokenValid: true});
      }
    }
    this.setState({isLoading: false});
  };

  render() {
    if (this.state.isLoading) {
      // We haven't finished checking for the token yet
      return <Splash />;
    }

    return (
      <NavigationContainer>
        <Stack.Navigator>
          {this.state.isTokenValid ? (
            <Stack.Screen name="Home" component={Home} />
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Send Reset Code" component={SendResetCode} />
              <Stack.Screen name="Verify Reset Code" component={VerifyResetCode} />
              <Stack.Screen name="Change Password" component={ChangePassword} />
            </>
          )}
        </Stack.Navigator>
        <KeepAwake />
      </NavigationContainer>
    );
  }
}
