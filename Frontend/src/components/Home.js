/* eslint-disable react/prefer-stateless-function */
import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import JwtDecode from 'jwt-decode';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

function Home1() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home1 Screen</Text>
    </View>
  );
}

function Home2() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home2 Screen</Text>
    </View>
  );
}

function Home3() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home3 Screen</Text>
    </View>
  );
}

function Home4() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home4 Screen</Text>
    </View>
  );
}

function Home5() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home5 Screen</Text>
    </View>
  );
}

export default class Home extends Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color}) => {
            let iconName;

            if (route.name === 'Home1') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Home2') {
              iconName = focused ? 'magnify' : 'magnify';
            } else if (route.name === 'Home3') {
              iconName = focused ? 'cards' : 'cards-outline';
            } else if (route.name === 'Home4') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Home5') {
              iconName = focused ? 'account' : 'account-outline';
            }

            // You can return any component that you like here!
            return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          showLabel: false,
        }}>
        <Tab.Screen name="Home1" component={Home1} />
        <Tab.Screen name="Home2" component={Home2} />
        <Tab.Screen name="Home3" component={Home3} />
        <Tab.Screen name="Home4" component={Home4} />
        <Tab.Screen name="Home5" component={Home5} />
      </Tab.Navigator>
    );
  }
}
