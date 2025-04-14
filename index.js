/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
// import App from './src/App';
import ScanQR from './src/ScanQR';
import CameraCapture from './src/CameraCapture';
import CaptureUpload from './src/CaptureUpload';

AppRegistry.registerComponent(appName, () => CaptureUpload);
