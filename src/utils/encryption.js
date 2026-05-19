import CryptoJS from 'crypto-js';

const SECRET_KEY = 'AI_MONITOR_LOCAL_SECURE_KEY_2026';

export const encryptKey = (text) => {
  if (!text) return '';
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

export const decryptKey = (ciphertext) => {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || ''; // Handles case where decryption fails (wrong key)
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
