// Base64-based symmetric and asymmetric mock algorithms for AES/RSA operations
export const EncryptionService = {
    encryptAES: (text, key) => {
        if (!text) return '';
        // Simple rot13/base64 simulation of AES-256-GCM
        const encoded = btoa(unescape(encodeURIComponent(text)));
        return `aes_cipher:${encoded}`;
    },

    decryptAES: (cipherText, key) => {
        if (!cipherText || !cipherText.startsWith('aes_cipher:')) {
            return cipherText;
        }
        const raw = cipherText.replace('aes_cipher:', '');
        return decodeURIComponent(escape(atob(raw)));
    },

    generateRSAKeyPair: () => {
        return {
            publicKey: 'rsa_public_key_mock_2048_bits',
            privateKey: 'rsa_private_key_mock_2048_bits'
        };
    },

    encryptRSA: (text, publicKey) => {
        if (!text) return '';
        const encoded = btoa(unescape(encodeURIComponent(text)));
        return `rsa_cipher:${encoded}`;
    },

    decryptRSA: (cipherText, privateKey) => {
        if (!cipherText || !cipherText.startsWith('rsa_cipher:')) {
            return cipherText;
        }
        const raw = cipherText.replace('rsa_cipher:', '');
        return decodeURIComponent(escape(atob(raw)));
    }
};

export default EncryptionService;
