import { z } from 'zod';

export const TaxRuleSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    country: z.string().length(2, 'كود الدولة يجب أن يتكون من حرفين (مثال: SA)'),
    name: z.string().min(2, 'مسمى الضريبة غير صالح (مثال: VAT)'),
    rate: z.number().min(0, 'نسبة الضريبة يجب أن تكون 0 أو أكبر').max(100, 'نسبة الضريبة لا يمكن أن تتعدى 100%'),
    status: z.enum(['Active', 'Inactive']).default('Active')
});

export const TaxRuleListSchema = z.array(TaxRuleSchema);

export default TaxRuleSchema;
