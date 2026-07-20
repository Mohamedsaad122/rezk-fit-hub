import { PolicyRepository } from '@/repositories/policy.repository';

export const PolicyService = {
    getPolicy: async () => {
        return PolicyRepository.getPolicy();
    },

    updatePolicy: async (data) => {
        return PolicyRepository.updatePolicy(data);
    },

    evaluateConstraints: async (ipAddress, country = 'SA', requestTime = null) => {
        const policy = await PolicyRepository.getPolicy();
        if (!policy) return true;

        // 1. IP Allowlist check
        if (policy.ipAllowList && policy.ipAllowList.length > 0) {
            if (!policy.ipAllowList.includes(ipAddress)) {
                throw new Error(`Access blocked: IP address "${ipAddress}" is not on the allowlist.`);
            }
        }

        // 2. Country block checks
        if (policy.blockedCountries && policy.blockedCountries.includes(country)) {
            throw new Error(`Access blocked: Logins from country "${country}" are restricted by policy.`);
        }

        // 3. Working Hours checks
        if (policy.workingHoursStart && policy.workingHoursEnd) {
            const time = requestTime || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            if (time < policy.workingHoursStart || time > policy.workingHoursEnd) {
                throw new Error(`Access blocked: Logins are restricted outside working hours (${policy.workingHoursStart} - ${policy.workingHoursEnd}).`);
            }
        }

        return true;
    }
};

export default PolicyService;
