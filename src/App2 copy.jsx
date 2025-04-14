import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import useBiometrics from './hooks/useBiometrics';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';

const Stack = createStackNavigator();

const App2 = () => {
  const {biometricLogin} = useBiometrics();

  useEffect(() => {
    const tryBiometricLogin = async () => {
      try {
        const token = await EncryptedStorage.getItem('auth_token');
        if (token) {
          const success = await biometricLogin();
          if (success) {
            console.log('Biometric login successful');
          }
        }
      } catch (error) {
        console.error('Biometric login check failed:', error);
      }
    };
    tryBiometricLogin();
  }, [biometricLogin]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Scan">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{title: 'Scan QR Code'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App2;
