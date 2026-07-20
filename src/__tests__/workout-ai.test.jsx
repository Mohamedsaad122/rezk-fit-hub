import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { WorkoutAIService } from '../services/workout-ai.service';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.3 AI Workout Routine Builders', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should generate target muscle workout plan exercises sets and reps details', async () => {
        TenantRepository.setActiveTenant(1);

        const result = await WorkoutAIService.generateWorkoutRoutine('سارة أحمد', 'Chest', 'Beginner');

        expect(result.name).toBeDefined();
        expect(result.exercises.length).toBeGreaterThan(0);
        expect(result.exercises[0].name).toBeDefined();
    });
});
