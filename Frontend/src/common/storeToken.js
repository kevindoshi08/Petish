import AsyncStorage from '@react-native-community/async-storage';

const storeToken = async () => {
  try {
    await AsyncStorage.setItem('@storage_Key', 'stored value');
  } catch (e) {
    // saving error
  }
};

export default storeToken;
