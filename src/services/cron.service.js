export const CronService = {
    evaluateCron: (cronExpr, date = new Date()) => {
        // Basic parser checks: e.g. "*/5 * * * *" or "* * * * *"
        // Returns true if date matches the expression rules.
        if (cronExpr === '* * * * *') return true;

        const parts = cronExpr.split(' ');
        if (parts.length !== 5) return false;

        const min = parts[0];
        const minutes = date.getMinutes();

        if (min.startsWith('*/')) {
            const step = parseInt(min.replace('*/', ''), 10);
            return minutes % step === 0;
        }

        if (min !== '*' && parseInt(min, 10) !== minutes) {
            return false;
        }

        return true;
    }
};

export default CronService;
