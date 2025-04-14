import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Alert,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import axios from 'axios';
// import Icon from 'react-native-vector-icons/MaterialIcons';

const CaptureUpload = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const format = useCameraFormat(device, [
    {photoResolution: {width: 375, height: 300}},
  ]);
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const takePhoto = async () => {
    if (!camera.current) {
      showAlert('Camera Error', 'Camera is not available');
      return;
    }

    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'auto',
      });
      console.log('Photo captured:', photo);

      const uri = `file://${photo.path}`;
      console.log('Photo URI:', uri);
      setPhotoUri(uri);

      // Optional: Save to Camera Roll
      try {
        const saved = await CameraRoll.saveAsset(uri, {type: 'photo'});
        console.log('Photo saved to Camera Roll:', saved);
        showAlert('Success', 'Photo saved to Camera Roll');
      } catch (saveError) {
        console.warn('Failed to save to camera roll:', saveError);
      }

      // Show preview and upload options
    } catch (error) {
      console.error('Error capturing photo:', error);
      showAlert('Capture Error', 'Failed to capture photo. Please try again.');
    }
  };

  const uploadPhoto = async () => {
    console.log('Uploading photo uri:', photoUri);
    if (!photoUri) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', {
      uri: photoUri,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
    });

    console.log('Uploading photo form data:', formData);

    try {
      const response = await axios.post(
        'http://192.168.1.6:8000/api/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
          onUploadProgress: progressEvent => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            // console.log('Upload progress:', progress);
            console.log(
              'Upload progress event data:',
              JSON.stringify(progressEvent),
            );
            setUploadProgress(progress);
          },
        },
      );
      console.log('Upload response:', response.data);

      showAlert('Success', 'Image uploaded successfully!', () => {
        setPhotoUri(null); // Return to camera view
      });

      console.log('Upload response:', response.data);
    } catch (error) {
      console.error('Upload error:', error);

      let errorMessage = 'Failed to upload photo. Please try again.';
      if (error.response) {
        // Handle validation errors from server
        if (error.response.status === 422 && error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors)
            .flat()
            .join('\n');
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }

      showAlert('Upload Error', errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const showAlert = (title, message, callback = null) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: () => callback && callback(),
        },
      ],
      {cancelable: false},
    );
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No camera device available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{uri: photoUri}} style={styles.previewImage} />

          <View style={styles.buttonGroup}>
            {isUploading ? (
              <View style={styles.uploadProgressContainer}>
                <ActivityIndicator size="large" color="#4a8cff" />
                <Text style={styles.progressText}>
                  Uploading... {uploadProgress}%
                </Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.uploadButton]}
                  onPress={uploadPhoto}
                  disabled={isUploading}>
                  {/* <Icon name="cloud-upload" size={24} color="white" /> */}
                  <Image
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: 'white',
                      marginRight: 5,
                    }}
                    source={require('./assets/upload.png')}
                    // style={styles.uploadImage}
                  />
                  <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.retakeButton]}
                  onPress={() => setPhotoUri(null)}
                  disabled={isUploading}>
                  <Image
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: 'white',
                      marginRight: 5,
                    }}
                    source={require('./assets/camera-rotate.png')}
                    // style={styles.retakeImage}
                  />
                  {/* <Icon name="camera" size={24} color="white" /> */}
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ) : (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            format={format}
            photo={true}
          />

          <View style={styles.captureButtonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#4a8cff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonGroup: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: '#4a8cff',
  },
  retakeButton: {
    backgroundColor: '#ff4757',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  uploadProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  progressText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CaptureUpload;

// import React, {useState, useRef, useEffect} from 'react';
// import {StyleSheet, View, Button, Image, Alert, Text} from 'react-native';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraPermission,
// } from 'react-native-vision-camera';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
// import axios from 'axios';

// const CaptureUpload = () => {
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
//       Alert.alert('Error', 'Camera is not available');
//       return;
//     }
//     try {
//       const photo = await camera.current.takePhoto({
//         qualityPrioritization: 'quality',
//         flash: 'on', //'off',
//       });

//       const uri = `file://${photo.path}`;
//       setPhotoUri(uri);

//       // Save to Camera Roll
//       const asset = await CameraRoll.saveAsset(uri, {type: 'photo'});
//       console.log('asset:', asset);
//       console.log('uri:', photoUri);
//       Alert.alert('Success', 'Photo saved to Camera Roll');

//       // Send to server
//       await uploadPhoto(uri);
//     } catch (error) {
//       console.error('Error capturing or processing photo:', error);
//       Alert.alert(
//         'Error',
//         `Failed to capture or process photo: ${error.message}`,
//       );
//     }
//   };

//   const uploadPhoto = async uri => {
//     console.log('Uploading photo:', uri);
//     if (!uri) {
//       console.error('No photo URI provided');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('image', {
//       uri: uri,
//       type: 'image/jpeg',
//       name: `image_${Date.now()}.jpg`,
//     });

//     console.log('formData:', formData);

//     try {
//       const response = await axios.post(
//         'http://192.168.191.34:8000/api/upload-image',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Accept: 'application/json',
//             //   Authorization: 'Bearer YOUR_ACCESS_TOKEN', // if needed
//           },
//         },
//       );

//       Alert.alert('Success', 'Image uploaded successfully');
//       console.log('Response:', response.data);
//     } catch (error) {
//       console.error('Error:', JSON.stringify(error, null, 2));
//       //   handle error 422
//       const errorMessage =
//         error.response?.data?.message || error.message || 'Upload failed';
//       Alert.alert('Error', `Failed to upload photo: ${errorMessage}`);
//     }

//     // try {
//     //   const formData = new FormData();
//     //   formData.append('image', {
//     //     uri: uri,
//     //     type: 'image/jpeg', // Adjust based on your image type
//     //     name: `photo_${Date.now()}.jpg`, // Unique filename
//     //   });

//     //   const response = await axios.post(
//     //     'http://192.168.191.34:8000/api/upload-image',
//     //     formData,
//     //     {
//     //       headers: {
//     //         'Content-Type': 'multipart/form-data',
//     //         Accept: 'application/json',
//     //       },
//     //     },
//     //   );

//     //   Alert.alert('Success', 'Image uploaded to server');
//     //   console.log('Upload response:', response.data);
//     // } catch (error) {
//     //   console.error('Error uploading photo:', error);
//     //   const errorMessage =
//     //     error.response?.data?.message || error.message || 'Upload failed';
//     //   Alert.alert('Error', `Failed to upload photo: ${errorMessage}`);
//     // }
//   };

//   if (!hasPermission) {
//     return (
//       <View style={styles.container}>
//         <Text>Requesting camera permission...</Text>
//       </View>
//     );
//   }

//   if (!device) {
//     return (
//       <View style={styles.container}>
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
//     bottom: 60,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
// });

// export default CaptureUpload;
