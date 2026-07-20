import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { TrustedDeviceListSchema } from '@/contracts/device.contract';

export const DeviceRepository = {
    getDevices: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.trustedDevices.getAll());
        } else {
            const res = await api.get('/api/saas/security/devices');
            result = res.data;
        }
        return parseApiResponse(TrustedDeviceListSchema, result, 'Trusted Devices List');
    },

    trustDevice: async (data) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.trustedDevices.create(data));
        } else {
            const res = await api.post('/api/saas/security/devices', data);
            return res.data;
        }
    },

    deleteDevice: async (id) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.trustedDevices.delete(id));
        } else {
            const res = await api.delete(`/api/saas/security/devices/${id}`);
            return res.data.success;
        }
    }
};

export default DeviceRepository;
