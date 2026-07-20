import { ProviderRepository } from '@/repositories/provider.repository';
import { CalendarAdapters } from './adapters/calendar.adapters';

export const CalendarSyncService = {
    syncWithProvider: async (provider) => {
        const adapter = CalendarAdapters[provider] || CalendarAdapters['Google Calendar'];
        const result = await adapter.sync();

        const log = await ProviderRepository.createSyncLog({
            provider,
            syncToken: `sync_${Math.random().toString(36).substring(2, 9)}`,
            status: result.success ? 'Success' : 'Failed',
            syncedItemsCount: result.syncedItemsCount,
            errorMessage: result.errorMessage
        });

        return log;
    }
};

export default CalendarSyncService;
