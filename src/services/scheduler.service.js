import { AutomationService } from './automation.service';

const activeTimers = new Map();

export const SchedulerService = {
    scheduleDelay: (id, delayMs, eventName, payload = {}) => {
        if (activeTimers.has(id)) {
            clearTimeout(activeTimers.get(id));
        }

        const timer = setTimeout(async () => {
            await AutomationService.triggerEvent(eventName, payload);
            activeTimers.delete(id);
        }, delayMs);

        activeTimers.set(id, timer);
        return true;
    },

    cancelScheduledDelay: (id) => {
        if (activeTimers.has(id)) {
            clearTimeout(activeTimers.get(id));
            activeTimers.delete(id);
            return true;
        }
        return false;
    }
};

export default SchedulerService;
