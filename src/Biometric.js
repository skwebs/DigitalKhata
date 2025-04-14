import {Alert, StyleSheet, Text, View} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import React, {useEffect} from 'react';

const Biometric = () => {
  useEffect(() => {
    const checkBiometric = async () => {
      //   try {
      //     const {available, biometryType} =
      //       await ReactNativeBiometrics.isSensorAvailable();
      //     if (available) {
      //       Alert.alert(
      //         'Biometric support available',
      //         `Biometry type: ${biometryType}`,
      //       );
      //     } else {
      //       Alert.alert('No biometric support available');
      //     }
      //   } catch (error) {
      //     console.error('Error checking biometric support:', error);
      //     Alert.alert('Error', 'Failed to check biometric support');
      //   }

      const rnBiometrics = new ReactNativeBiometrics();

      const {biometryType} = await rnBiometrics.isSensorAvailable();

      if (biometryType === BiometryTypes.TouchID) {
        //do something fingerprint specific
        Alert.alert('Alert', 'TouchID is available');
      } else if (biometryType === BiometryTypes.FaceID) {
        //do something face id specific
        Alert.alert('Alert', 'FaceID is available');
      } else if (biometryType === BiometryTypes.Biometrics) {
        //do something face id specific
        // Alert.alert('Alert', 'Biometrics is available');
        // if biometrics is available, you can proceed with authentication
        const {success} = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirm fingerprint',
        });
        if (success) {
          Alert.alert('Success', 'Authenticated successfully');
        } else {
          Alert.alert('Error', 'Authentication failed');
        }
      } else {
        Alert.alert('Alert', 'Biometric is not available');
      }
    };
    // checkBiometric();

    const checkBio = () => {
      //   const rnBiometrics = new ReactNativeBiometrics();
      const rnBiometrics = new ReactNativeBiometrics({
        allowDeviceCredentials: true,
      });

      rnBiometrics.isSensorAvailable().then(resultObject => {
        const {available, biometryType} = resultObject;

        if (available && biometryType === BiometryTypes.TouchID) {
          console.log('TouchID is supported');
        } else if (available && biometryType === BiometryTypes.FaceID) {
          console.log('FaceID is supported');
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          console.log('Biometrics is supported');
        } else {
          console.log('Biometrics not supported');
        }
      });
    };
    checkBio();
  }, []);

  //   useEffect(() => {
  //     ReactNativeBiometrics.simplePrompt({
  //       promptMessage: 'Login with biometrics',
  //       cancelButtonText: 'Cancel',
  //       fallbackEnabled: true, // Allow fallback to device credentials
  //       fallbackTitle: 'Use passcode instead', // Only for iOS
  //     });
  //   }, []);
  return (
    <View>
      <Text>Biometric</Text>
    </View>
  );
};

export default Biometric;

const styles = StyleSheet.create({});
