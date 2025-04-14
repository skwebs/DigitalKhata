import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  Code,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from 'react-native-vision-camera';

function App() {
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const camera = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [mode, setMode] = useState('front');

  React.useEffect(() => {
    requestPermission();
  });

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean13', 'ean8', 'code39', 'code128'],
    onCodeScanned: code => {
      console.log('Code scanned', code);
    },
    onError: error => {
      console.log('Code scanner error', error);
    },
  });

  if (device == null) {
    return (
      <View>
        <Text>Camera not found</Text>
      </View>
    );
  }
  if (!hasPermission) {
    // request permission
    const request = async () => {
      const permission = await requestPermission();
      if (permission === 'denied') {
        console.log('Camera permission denied');
      } else if (permission === 'granted') {
        console.log('Camera permission granted');
      }
    };
    request();
  }
  // prompt user for camera permission

  const takePicture = async () => {
    console.log('Taking picture');
    if (camera.current == null) {
      console.log('Camera is not ready');
      return;
    }

    const photo = await camera.current.takePhoto({
      flash: 'off',
      qualityPrioritization: 'speed',
      quality: 'low',
      skipMetadata: true,
    });
    console.log(photo.path);
    setCapturedImage(photo.path);
  };
  const handleCameraReady = async () => {
    await camera.current.prepare();
  };
  if (capturedImage) {
    return (
      <View>
        <Text>Picture taken</Text>
        <Image
          style={{width: 200, height: 200}}
          src={{uri: `file://${capturedImage}`}}
        />
      </View>
    );
  }
  return (
    <>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        codeScanner={codeScanner}
        mode={mode}
        isActive={true}
        photo={true}
      />
      <View
        style={{
          flex: 1,
          gap: 20,
          flexDirection: 'column',
        }}>
        <TouchableOpacity
          onPress={takePicture}
          style={{
            margin: 20,
            padding: 10,
            backgroundColor: 'white',
          }}
          onLongPress={handleCameraReady}>
          <Text>Take picture</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMode(mode === 'front' ? 'back' : 'front');
          }}
          style={{
            margin: 20,
            padding: 10,
            backgroundColor: 'white',
          }}
          onLongPress={handleCameraReady}>
          <Text>Toggle camera</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default App;

const styles = StyleSheet.create({});
