import React, {useState, useCallback} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

const ScanScreen = ({navigation}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScannedData = useCallback(
    async data => {
      if (isProcessing) {
        return;
      }
      setIsProcessing(true);

      try {
        const token = await EncryptedStorage.getItem('auth_token');
        if (!token) {
          Alert.alert('Error', 'Please log in first');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.post(
          'https://your-api.com/api/scan',
          {scanned_data: data},
          {headers: {Authorization: `Bearer ${token}`}},
        );

        Alert.alert(
          'Success',
          response.data.message || 'Data processed successfully',
        );
        navigation.goBack();
      } catch (error) {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to process scanned data',
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, navigation],
  );

  const onSuccess = e => {
    handleScannedData(e.data);
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        topContent={<Text style={styles.centerText}>Scan a QR code</Text>}
        bottomContent={
          <Button title="Cancel" onPress={() => navigation.goBack()} />
        }
        cameraStyle={styles.camera}
        reactivate={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centerText: {fontSize: 18, padding: 32, color: '#777'},
  camera: {height: '80%'},
});

export default ScanScreen;
