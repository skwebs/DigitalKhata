import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import useBiometrics from '../hooks/useBiometrics';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {isBiometricAvailable, enableBiometrics} = useBiometrics();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://your-api.com/api/login', {
        email,
        password,
      });

      const {token, user} = response.data;
      await EncryptedStorage.setItem('auth_token', token);

      const biometricAvailable = await isBiometricAvailable();
      if (biometricAvailable) {
        Alert.alert(
          'Enable Biometrics',
          'Would you like to enable biometric login for next time?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Enable',
              onPress: async () => {
                const success = await enableBiometrics(user.id, token);
                if (success) {
                  Alert.alert('Success', 'Biometric login enabled');
                } else {
                  Alert.alert('Error', 'Failed to enable biometrics');
                }
              },
            },
          ],
        );
      }

      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{borderWidth: 1, marginBottom: 10}}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{borderWidth: 1, marginBottom: 10}}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
