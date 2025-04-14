// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const BiometricNext = () => {
//   return (
//     <View>
//       <Text>BiometricNext</Text>
//     </View>
//   )
// }

// export default BiometricNext

// const styles = StyleSheet.create({})

import './global.css';
import './gesture-handler';

import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import {
  enableBioMetric,
  checkBiometricSupport,
  checkNewFingerPrintAdded,
} from 'react-native-biometric-check';

import React, {useEffect} from 'react';

const BiometricNext = () => {
  useEffect(() => {
    checkNewFingerPrintAdded(res => {
      if (res === 'NEW_FINGERPRINT_ADDED') {
        Alert.alert('Alert', res);
      }
    });

    if (Platform.OS === 'ios') {
      enableBioMetric(
        'Use passcode',
        'Enter phone screen lock pattern, PIN, password or fingerprint',
        res => {
          switch (res) {
            case 1:
              Alert.alert(
                'Alert',
                'Biometric authentication not available on the device',
              );
              break;
            case 2:
              Alert.alert(
                'Alert',
                'Biometric authentication is locked due to too many failed attempts',
              );
              break;
            case 3:
              Alert.alert('Alert', 'Biometric authentication is not enrolled');
              break;
            case 4:
              Alert.alert('Alert', 'BIOMETRIC_STATUS_UNKNOWN');
              break;
            case 5:
              Alert.alert('Success', 'Verified successfully');
              break;
            default:
              Alert.alert('Error', `${res}`);
          }
        },
      );
      return;
    }

    checkBiometricSupport(res => {
      if (res === 'SUCCESS') {
        enableBioMetric(
          'Biometric',
          'Enter phone screen lock pattern, PIN, password or fingerprint',
          res2 => {
            Alert.alert('Status', `${res2}`);
          },
        );
      } else {
        Alert.alert('Alert', res);
      }
    });
  }, []);
  return (
    <View className="flex-1 items-center  ">
      <Text className="text-3xl font-bold text-blue-500">Hello world!</Text>
      <Text>BiometricNext</Text>
    </View>
  );
};

export default BiometricNext;

const styles = StyleSheet.create({});
