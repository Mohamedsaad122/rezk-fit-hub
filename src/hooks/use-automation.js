import { useQuery } from '@tanstack/react-query';
import { AutomationRepository } from '@/repositories/automation.repository';

export const useAutomation = () => {
    const logsQuery = useQuery({
        queryKey: ['automation-logs'],
        queryFn: () => AutomationRepository.getLogs()
    });

    return {
        logs: logsQuery.data || [],
        isLoading: logsQuery.isLoading
    };
};

export default useAutomation;
