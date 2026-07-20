export const RuleEngineService = {
    evaluateRule: (rule, context = {}) => {
        if (rule.status === 'Disabled') return false;

        const conditions = rule.conditions || [];
        if (conditions.length === 0) return true;

        // Evaluate all conditions (AND logic)
        for (const cond of conditions) {
            const contextValue = context[cond.field];
            
            switch (cond.operator) {
                case 'EQUALS':
                    if (String(contextValue) !== String(cond.value)) return false;
                    break;
                case 'NOT_EQUALS':
                    if (String(contextValue) === String(cond.value)) return false;
                    break;
                case 'GREATER_THAN':
                    if (Number(contextValue) <= Number(cond.value)) return false;
                    break;
                case 'LESS_THAN':
                    if (Number(contextValue) >= Number(cond.value)) return false;
                    break;
                case 'CONTAINS':
                    if (!String(contextValue).includes(String(cond.value))) return false;
                    break;
                default:
                    return false;
            }
        }

        return true;
    },

    sortRulesByPriority: (rules) => {
        return [...rules].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    },

    resolveConflicts: (rules, context = {}) => {
        const matchingRules = rules.filter(r => RuleEngineService.evaluateRule(r, context));
        const sortedRules = RuleEngineService.sortRulesByPriority(matchingRules);
        
        const resolvedRules = [];
        const seenActionTypes = new Set();
        
        for (const rule of sortedRules) {
            let conflict = false;
            const ruleActions = rule.actions || [];
            
            for (const action of ruleActions) {
                if (seenActionTypes.has(action.actionType)) {
                    conflict = true;
                    break;
                }
            }
            
            if (!conflict) {
                resolvedRules.push(rule);
                ruleActions.forEach(action => seenActionTypes.add(action.actionType));
            }
        }
        
        return resolvedRules;
    },

    evaluateFormula: (formula, variables = {}) => {
        // Safe evaluation of simple math expressions like "x * 10" or "price - discount"
        let resultString = formula;
        Object.entries(variables).forEach(([key, val]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            resultString = resultString.replace(regex, val);
        });

        try {
            // Basic sanitization: allow only numbers, basic operators, and spaces
            if (/[^0-9+\-*/().\s]/.test(resultString)) {
                throw new Error('Forbidden characters in formula expression');
            }
            return eval(resultString);
        } catch {
            return null;
        }
    }
};

export default RuleEngineService;
