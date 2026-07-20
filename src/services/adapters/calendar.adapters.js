export const CalendarAdapters = {
    'Google Calendar': {
        sync: async (tenantId) => {
            return {
                success: true,
                syncedItemsCount: 12,
                errorMessage: null
            };
        }
    },
    'Microsoft Outlook': {
        sync: async (tenantId) => {
            return {
                success: true,
                syncedItemsCount: 8,
                errorMessage: null
            };
        }
    },
    'FailedProvider': {
        sync: async (tenantId) => {
            return {
                success: false,
                syncedItemsCount: 0,
                errorMessage: 'API timeout response from remote calendar authority'
            };
        }
    }
};

export default CalendarAdapters;
