import { describe, it, expect } from 'vitest';
import { PaginationQuerySchema } from '../contracts/pagination.contract';
import { ClientRepository } from '../repositories/client.repository';
import AppConfig from '../config/app.config';

describe('Pagination & Query Parameters Validation Tests', () => {
    describe('Query Parameters Zod Contract checks', () => {
        it('should accept valid page and limit numbers', () => {
            const query = { page: 2, limit: 15, search: 'احمد', status: 'نشط' };
            const result = PaginationQuerySchema.safeParse(query);
            expect(result.success).toBe(true);
        });

        it('should fail on negative page numbers', () => {
            const query = { page: -1, limit: 10 };
            const result = PaginationQuerySchema.safeParse(query);
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('رقم الصفحة يجب أن يكون أكبر من 0');
        });

        it('should fail on zero limit constraint', () => {
            const query = { page: 1, limit: 0 };
            const result = PaginationQuerySchema.safeParse(query);
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('عدد العناصر يجب أن يكون أكبر من 0');
        });

        it('should fail on too large limits constraint', () => {
            const query = { page: 1, limit: 250 };
            const result = PaginationQuerySchema.safeParse(query);
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('الحد الأقصى للعناصر هو 100');
        });
    });

    describe('Repository Pagination & Slicing Transactions', () => {
        it('should slice mock database records correctly in paginated response shape', async () => {
            AppConfig.enableMock = true;
            
            // Query first page with limit 2
            const response = await ClientRepository.getAll({ page: 1, limit: 2 });
            
            expect(response).toHaveProperty('data');
            expect(response).toHaveProperty('meta');
            expect(response.data.length).toBe(2);
            expect(response.meta.page).toBe(1);
            expect(response.meta.limit).toBe(2);
            expect(response.meta.total).toBe(5); // total default clients is 5
            expect(response.meta.totalPages).toBe(3); // 5 clients / 2 limit = 3 pages
        });

        it('should return empty data array when page index exceeds totalPages count', async () => {
            AppConfig.enableMock = true;
            
            const response = await ClientRepository.getAll({ page: 10, limit: 10 });
            expect(response.data.length).toBe(0);
            expect(response.meta.total).toBe(5);
        });

        it('should combine text search query and pagination slicing parameters', async () => {
            AppConfig.enableMock = true;
            
            // "سارة" should match Client 1Sara Ahmed
            const response = await ClientRepository.getAll({ page: 1, limit: 10, search: 'سارة' });
            expect(response.data.length).toBe(1);
            expect(response.data[0].name).toContain('سارة');
            expect(response.meta.total).toBe(1);
        });
    });
});
