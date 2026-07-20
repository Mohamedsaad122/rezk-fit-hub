import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { DeviceSchema, DeviceListSchema } from '@/contracts/device.contract';

export const OfflineRepository = {
    getDevices: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devices.getAll());
        } else {
            const res = await api.get('/api/saas/offline/devices');
            result = res.data;
        }
        return parseApiResponse(DeviceListSchema, result, 'Device List');
    },

    registerDevice: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devices.create(data));
        } else {
            const res = await api.post('/api/saas/offline/devices', data);
            result = res.data;
        }
        return parseApiResponse(DeviceSchema, result, 'Device Register');
    }
};

export default OfflineRepository;
