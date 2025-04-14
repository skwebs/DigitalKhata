// import React, {useState, useRef, useEffect} from 'react';
// import {StyleSheet, View, Button, Image, Alert, Text} from 'react-native';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraPermission,
// } from 'react-native-vision-camera';
// import CameraRoll from '@react-native-camera-roll/camera-roll';

// const CameraCapture = () => {
//   const {hasPermission, requestPermission} = useCameraPermission();
//   const device = useCameraDevice('back');
//   const camera = useRef(null);
//   const [photoUri, setPhotoUri] = useState(null);

//   useEffect(() => {
//     if (!hasPermission) {
//       requestPermission();
//     }
//   }, [hasPermission, requestPermission]);

//   const takePhoto = async () => {
//     if (!camera.current) {
//       console.error('Camera reference not available');
//       return;
//     }
//     try {
//       const photo = await camera.current.takePhoto({
//         qualityPrioritization: 'quality',
//         flash: 'off',
//       });
//       setPhotoUri(`file://${photo.path}`);

//       // Save to Camera Roll
//       const res = await CameraRoll.saveAsset(`file://${photo.path}`, {
//         type: 'photo',
//       });
//       console.log('Photo saved to Camera Roll:', res);
//       Alert.alert('Success', 'Photo saved to Camera Roll');
//     } catch (error) {
//       console.error('Error capturing photo:', error);
//       Alert.alert('Error', 'Failed to capture or save photo');
//     }
//   };

//   if (!hasPermission) {
//     return (
//       <View>
//         <Text>Requesting camera permission...</Text>
//       </View>
//     );
//   }

//   if (!device) {
//     return (
//       <View>
//         <Text>No camera device available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {photoUri ? (
//         <View style={styles.previewContainer}>
//           <Image source={{uri: photoUri}} style={styles.previewImage} />
//           <Button
//             title="Take Another Photo"
//             onPress={() => setPhotoUri(null)}
//           />
//         </View>
//       ) : (
//         <>
//           <Camera
//             ref={camera}
//             style={StyleSheet.absoluteFill}
//             device={device}
//             isActive={true}
//             photo={true}
//           />
//           <View style={styles.buttonContainer}>
//             <Button title="Take Photo" onPress={takePhoto} />
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   previewContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   previewImage: {
//     width: '90%',
//     height: '80%',
//     resizeMode: 'contain',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
// });

// export default CameraCapture;
import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Button, Image, Alert, Text} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const CameraCapture = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const takePhoto = async () => {
    if (!camera.current) {
      console.error('Camera reference not available');
      Alert.alert('Error', 'Camera is not available');
      return;
    }
    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
      });

      const uri = `file://${photo.path}`;
      setPhotoUri(uri);

      // Save to Camera Roll
      await CameraRoll.saveAsset(uri, {type: 'photo'});
      Alert.alert('Success', 'Photo saved to Camera Roll');
    } catch (error) {
      console.error('Error capturing or saving photo:', error);
      Alert.alert('Error', `Failed to capture or save photo: ${error.message}`);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No camera device available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{uri: photoUri}} style={styles.previewImage} />
          <Button
            title="Take Another Photo"
            onPress={() => setPhotoUri(null)}
          />
        </View>
      ) : (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <View style={styles.buttonContainer}>
            <Button title="Take Photo" onPress={takePhoto} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default CameraCapture;
