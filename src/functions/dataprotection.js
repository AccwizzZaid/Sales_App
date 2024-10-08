import CryptoJS from 'crypto-js';

// Encrypt data (compatible with your server)
export const encryptData = (data, secretKey) => {
    try {
        // Check if the data is an object or string and convert it to a string
        const dataToEncrypt = typeof data === 'object' ? JSON.stringify(data) : data;

        // Encrypt the string data
        const ciphertext = CryptoJS.AES.encrypt(dataToEncrypt, secretKey).toString();
        return ciphertext;
    } catch (error) {
        console.log('Encryption error:', error);
    }
};

// Decrypt data (compatible with your server)
export const decryptData = (ciphertext, secretKey) => {
    try {
        // Decrypt the ciphertext
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        // Attempt to parse the decrypted data, if it's JSON
        try {
            return JSON.parse(decryptedData);
        } catch (e) {
            return decryptedData; // Return as plain text if not JSON
        }
    } catch (error) {
        console.log('Decryption error:', error);
    }
};
