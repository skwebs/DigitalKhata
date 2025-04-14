import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  Image,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {RNHoleView} from 'react-native-hole-view';
function ScanQR() {
  const {hasPermission, requestPermission} = useCameraPermission();
  const [isRear, setIsRear] = useState(true);
  const frontDevice = useCameraDevice('front');
  const backDevice = useCameraDevice('back');
  const device = isRear ? backDevice : frontDevice;
  const [latestScannedData, setLatestScannedData] = useState(null);
  const [isScanned, setIsScanned] = useState(false);

  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      // Update the state with the latest scanned data
      if (!isScanned) {
        setLatestScannedData(codes[0].value);
        Vibration.vibrate(20);
        console.log(codes[0].value);
        console.log(`Scanned ${codes.length} codes!`);
        setIsScanned(true);
      }
    },
  });

  if (device == null) {
    return (
      <View>
        <Text>Device Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={[StyleSheet.absoluteFill, styles.camera]}
        codeScanner={codeScanner}
        device={device}
        isActive={true}
      />

      {/* <Camera style={styles.camera} enableZoom codeScanner={codeScanner} /> */}
      {/* <HoleView
        style={styles.holeView}
        width={200} // Adjust as needed
        height={200} // Adjust as needed
        color="rgba(0,0,0,0.5)"
        innerColor="white"
      /> */}
      <RNHoleView
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        holes={[
          {x: 0, y: 0, width: 200, height: 200, borderRadius: 6},
        ]}></RNHoleView>
      {/* {scannedData && (
        <View style={styles.scannedData}>
          <Text>Scanned Data: {scannedData[0].data}</Text>
        </View>
      )} */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 10,
          borderRadius: 5,
        }}>
        <TouchableOpacity onPress={() => setIsRear(!isRear)}>
          <Image
            source={require('./assets/camera-rotate.png')} // Replace with your icon path
            style={{
              width: 30,
              height: 30,
              marginBottom: 10,
              tintColor: 'white',
            }}
          />
          <Text style={{fontSize: 20, color: 'white'}}>
            {!isRear ? 'Rear' : 'Front'}
          </Text>
        </TouchableOpacity>
      </View>
      {latestScannedData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Latest Scanned Code:</Text>
          <Text style={styles.resultText}>{latestScannedData}</Text>
          <TouchableOpacity
            style={{
              marginVertical: 10,
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'white',
            }}
            onPress={() => {
              setLatestScannedData(null);
              setIsScanned(false);
              Vibration.vibrate(20);
            }}>
            <Text>Scan New</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 40, // Adjust the position to provide space between the camera view and the result container
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  resultText: {
    fontSize: 14,
    color: 'white',
  },
  camera: {
    flex: 1,
    backgroundColor: 'black',
  },
  holeView: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -100}, {translateY: -100}],
  },
  scannedData: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
});

export default ScanQR;
