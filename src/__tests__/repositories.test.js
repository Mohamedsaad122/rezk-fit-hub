import { describe, it, expect, beforeEach } from 'vitest';
import { ClientRepository } from '../repositories/client.repository';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { mockDatabase } from '../mocks/mockDatabase';
import AppConfig from '../config/app.config';

describe('Repositories & Mock Database CRUD/Isolation Tests', () => {
    beforeEach(() => {
        // Enforce Mock Mode
        AppConfig.enableMock = true;
    });

    describe('Client Repository CRUD Transactions', () => {
        it('should fetch all client listings matching the contract schemas', async () => {
            const list = await ClientRepository.getAll();
            expect(list.length).toBeGreaterThan(0);
            expect(list[0]).toHaveProperty('id');
            expect(list[0]).toHaveProperty('name');
            expect(list[0]).toHaveProperty('assignedCategoryId');
        });

        it('should get client detail profile by ID', async () => {
            const client = await ClientRepository.getById(1);
            expect(client).not.toBeNull();
            expect(client.id).toBe(1);
        });

        it('should return null for non-existent client ID', async () => {
            const client = await ClientRepository.getById(999);
            expect(client).toBeNull();
        });

        it('should create client and persist to mock database', async () => {
            const payload = {
                name: 'خالد يوسف',
                email: 'khaled@rezkfit.com',
                phone: '+201066666666',
                age: 30,
                currentWeight: 82.5,
                targetWeight: 75.0,
                goal: 'زيادة العضلات',
                subscriptionStatus: 'نشط',
                assignedCategoryId: 'gym'
            };
            const created = await ClientRepository.create(payload);
            expect(created).toHaveProperty('id');
            expect(created.name).toBe('خالد يوسف');

            const fetched = await ClientRepository.getById(created.id);
            expect(fetched).not.toBeNull();
            expect(fetched.email).toBe('khaled@rezkfit.com');
        });

        it('should update client fields cleanly', async () => {
            const updated = await ClientRepository.update(1, { name: 'سارة أحمد محمد' });
            expect(updated.name).toBe('سارة أحمد محمد');

            const fetched = await ClientRepository.getById(1);
            expect(fetched.name).toBe('سارة أحمد محمد');
        });

        it('should delete client and clean database entry', async () => {
            const countBefore = (await ClientRepository.getAll()).length;
            const success = await ClientRepository.delete(2);
            expect(success).toBe(true);

            const countAfter = (await ClientRepository.getAll()).length;
            expect(countAfter).toBe(countBefore - 1);

            const fetched = await ClientRepository.getById(2);
            expect(fetched).toBeNull();
        });
    });

    describe('Exercise Repository CRUD Transactions', () => {
        it('should fetch exercise categories', async () => {
            const categories = await ExerciseRepository.getAll();
            expect(categories.length).toBeGreaterThan(0);
            expect(categories[0]).toHaveProperty('id');
            expect(categories[0]).toHaveProperty('exercises');
        });

        it('should create a new exercise under a category', async () => {
            const exercisePayload = {
                name: 'تمرين بايسبس بالدمبل',
                duration: '10 دقائق',
                difficulty: 'مبتدئ',
                sets: '3 مجموعات × 12 تكرار',
                image: '💪'
            };
            const created = await ExerciseRepository.create('gym', exercisePayload);
            expect(created).toHaveProperty('id');
            expect(created.name).toBe('تمرين بايسبس بالدمبل');

            const gymExercises = await ExerciseRepository.getByCategory('gym');
            const found = gymExercises.some(ex => ex.id === created.id);
            expect(found).toBe(true);
        });
    });

    describe('Data Isolation and Defensive Cloning Verification', () => {
        it('should verify that direct mutation of returned data does not pollute DB state', async () => {
            // 1. Read client profile
            const originalClient = await ClientRepository.getById(1);
            expect(originalClient.name).toBe('سارة أحمد');

            // 2. Mutate the returned object directly in tests
            originalClient.name = 'اسم مخرب خبيث';

            // 3. Read again from repository and verify it is completely unaffected
            const refreshedClient = await ClientRepository.getById(1);
            expect(refreshedClient.name).toBe('سارة أحمد');
            expect(refreshedClient.name).not.toBe('اسم مخرب خبيث');
        });
    });

    describe('Mock Database Reset Lifecycle', () => {
        it('should mutate database state and ensure reset() clears changes', async () => {
            const countBefore = (await ClientRepository.getAll()).length;
            
            // Delete client 1
            await ClientRepository.delete(1);
            const countAfterDelete = (await ClientRepository.getAll()).length;
            expect(countAfterDelete).toBe(countBefore - 1);
            
            // Trigger database reset
            mockDatabase.reset();
            
            const countAfterReset = (await ClientRepository.getAll()).length;
            expect(countAfterReset).toBe(countBefore);
        });
    });
});
