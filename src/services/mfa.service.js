import { MfaRepository } from '@/repositories/mfa.repository';

export const MfaService = {
    setupMfa: async (userId) => {
        const secret = `secret_totp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/RezkFitHub:${userId}?secret=${secret}&issuer=RezkFitHub`;
        
        // Generate 10 random 8-character recovery codes
        const recoveryCodes = Array.from({ length: 8 }, () => 
            Math.random().toString(36).substring(2, 10).toUpperCase()
        );

        const settings = {
            enabled: false, // Pending verification
            secret,
            qrCodeUrl,
            recoveryCodes
        };

        await MfaRepository.saveSettings(userId, settings);
        return settings;
    },

    verifyAndEnableMfa: async (userId, code) => {
        const settings = await MfaRepository.getSettings(userId);
        if (!settings) {
            throw new Error('MFA setup not found');
        }

        // Mock verification validation
        if (code !== '123456' && code !== '000000') {
            throw new Error('Invalid MFA verification code');
        }

        settings.enabled = true;
        await MfaRepository.saveSettings(userId, settings);
        return settings;
    },

    verifyOtp: async (userId, code) => {
        const settings = await MfaRepository.getSettings(userId);
        if (!settings || !settings.enabled) return true; // MFA not enabled

        if (code !== '123456' && code !== '000000' && !settings.recoveryCodes.includes(code)) {
            throw new Error('Invalid MFA authentication code');
        }

        // If recovery code used, rotate/remove it
        if (settings.recoveryCodes.includes(code)) {
            settings.recoveryCodes = settings.recoveryCodes.filter(c => c !== code);
            await MfaRepository.saveSettings(userId, settings);
        }

        return true;
    },

    getSettings: async (userId) => {
        return MfaRepository.getSettings(userId);
    }
};

export default MfaService;
