import { DeviceRepository } from '@/repositories/device.repository';

export const DeviceService = {
    getDevices: async () => {
        return DeviceRepository.getDevices();
    },

    trustDevice: async (userId, fingerprint, name, os, browser) => {
        const payload = {
            userId,
            fingerprint,
            name,
            os,
            browser
        };
        return DeviceRepository.trustDevice(payload);
    },

    deleteDevice: async (id) => {
        return DeviceRepository.deleteDevice(id);
    },

    isDeviceTrusted: async (fingerprint) => {
        const devices = await DeviceRepository.getDevices();
        return devices.some(d => d.fingerprint === fingerprint);
    }
};

export default DeviceService;
