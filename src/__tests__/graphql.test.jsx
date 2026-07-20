import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { GraphqlService } from '../services/graphql.service';

describe('GraphQL Engine & Playground Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should expose the schema types and definitions structure', () => {
        const schema = GraphqlService.getSchema();
        expect(schema).toContain('type Client');
        expect(schema).toContain('type Task');
        expect(schema).toContain('type Query');
    });

    it('should resolve clients and tasks queries against in-memory models', async () => {
        const query = `
            query {
                clients {
                    id
                    name
                }
                tasks {
                    id
                    title
                }
            }
        `;

        const response = await GraphqlService.execute(query);
        expect(response.data).toBeDefined();
        expect(response.data.clients.length).toBeGreaterThan(0);
        expect(response.data.tasks.length).toBeGreaterThan(0);
    });
});
