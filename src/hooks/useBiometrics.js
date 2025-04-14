import {useCallback, useMemo} from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

const useBiometrics = () => {
  const rnBiometrics = useMemo(() => new ReactNativeBiometrics(), []);

  const isBiometricAvailable = useCallback(async () => {
    const {available} = await rnBiometrics.isSensorAvailable();
    return available;
  }, [rnBiometrics]);

  const enableBiometrics = useCallback(
    async (userId, token) => {
      try {
        const {available} = await rnBiometrics.isSensorAvailable();
        if (!available) {
          throw new Error('Biometrics not available');
        }

        const {publicKey} = await rnBiometrics.createKeys();
        await axios.post(
          'https://your-api.com/api/enable-biometric',

          {biometric_token: publicKey},
          {headers: {Authorization: `Bearer ${token}`}},
        );

        await EncryptedStorage.setItem('user_id', userId.toString());
        return true;
      } catch (error) {
        console.error('Error enabling biometrics:', error);
        return false;
      }
    },
    [rnBiometrics],
  );

  const biometricLogin = useCallback(async () => {
    try {
      const userId = await EncryptedStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const {success, signature} = await rnBiometrics.createSignature({
        promptMessage: 'Sign in with biometrics',
        payload: userId,
      });

      if (!success || !signature) {
        throw new Error('Biometric authentication failed');
      }

      const response = await axios.post(
        'https://your-api.com/api/biometric-login',
        {
          user_id: userId,
          signature,
        },
      );

      await EncryptedStorage.setItem('auth_token', response.data.token);
      return true;
    } catch (error) {
      console.error('Biometric login error:', error);
      return false;
    }
  }, [rnBiometrics]);

  return useMemo(
    () => ({
      isBiometricAvailable,
      enableBiometrics,
      biometricLogin,
    }),
    [isBiometricAvailable, enableBiometrics, biometricLogin],
  );
};

export default useBiometrics;
