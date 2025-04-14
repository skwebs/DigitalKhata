import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import * as ReactNativeBiometrics from 'react-native-biometrics';

const BiometricAuth = () => {
  const [biometricType, setBiometricType] = useState(null);
  const [authResult, setAuthResult] = useState(null);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const {available, biometryType} =
        await ReactNativeBiometrics.isSensorAvailable();

      if (available) {
        setBiometricType(biometryType);
      } else {
        setBiometricType('Biometrics not available');
      }
    } catch (error) {
      console.error('Biometric check error:', error);
      setBiometricType('Error checking biometrics');
    }
  };

  const authenticate = async () => {
    try {
      const {success} = await ReactNativeBiometrics.simplePrompt({
        promptMessage: 'Authenticate to continue',
        cancelButtonText: 'Cancel',
      });

      if (success) {
        setAuthResult('Authentication successful');
        // Proceed with your app logic
      } else {
        setAuthResult('Authentication failed or canceled');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthResult('Authentication error');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Biometric Type: {biometricType}</Text>
      <Button title="Authenticate" onPress={authenticate} />
      {authResult && <Text>{authResult}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BiometricAuth;
