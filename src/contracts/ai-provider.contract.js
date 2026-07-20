import { z } from 'zod';

export const AIProviderConfigSchema = z.object({
    activeProvider: z.enum(['OpenAI', 'AzureOpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Ollama', 'Mock']),
    apiKey: z.string().optional().default(''),
    endpoint: z.string().optional().default(''),
    modelName: z.string().optional().default(''),
    temperature: z.number().min(0).max(2).default(0.7)
});

export default AIProviderConfigSchema;
