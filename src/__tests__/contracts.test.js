import { describe, it, expect } from 'vitest';
import { LoginRequestSchema, LoginResponseSchema } from '../contracts/auth.contract';
import { ClientRequestSchema } from '../contracts/client.contract';
import { ExerciseRequestSchema } from '../contracts/exercise.contract';
import { NutritionPlanRequestSchema } from '../contracts/nutrition.contract';

describe('Zod API Contracts Unit Tests', () => {
    describe('Authentication Contracts', () => {
        it('should pass valid login request', () => {
            const payload = { email: 'coach@rezkfit.com', password: 'password123' };
            const result = LoginRequestSchema.safeParse(payload);
            expect(result.success).toBe(true);
        });

        it('should fail login request with invalid email format', () => {
            const payload = { email: 'not-an-email', password: 'password123' };
            const result = LoginRequestSchema.safeParse(payload);
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('صيغة البريد الإلكتروني غير صحيحة');
        });

        it('should fail login request with short password length', () => {
            const payload = { email: 'coach@rezkfit.com', password: '123' };
            const result = LoginRequestSchema.safeParse(payload);
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل');
        });

        it('should validate complete login response payload', () => {
            const payload = {
                user: {
                    id: 1,
                    name: 'Coach Yousef',
                    email: 'coach@rezkfit.com',
                    role: 'coach'
                },
                accessToken: 'valid-access-token',
                refreshToken: 'valid-refresh-token'
            };
            const result = LoginResponseSchema.safeParse(payload);
            expect(result.success).toBe(true);
        });

        it('should fail login response validation when tokens are missing', () => {
            const payload = {
                user: { id: 1, name: 'Coach Yousef', email: 'coach@rezkfit.com', role: 'coach' }
            };
            const result = LoginResponseSchema.safeParse(payload);
            expect(result.success).toBe(false);
        });
    });

    describe('Clients Contracts', () => {
        it('should validate correct client model request data', () => {
            const payload = {
                name: 'سارة أحمد',
                email: 'sara@example.com',
                phone: '+201011111111',
                age: 24,
                currentWeight: 68.5,
                targetWeight: 60.0,
                goal: 'خسارة الدهون',
                subscriptionStatus: 'نشط',
                assignedCategoryId: 'gym'
            };
            const result = ClientRequestSchema.safeParse(payload);
            expect(result.success).toBe(true);
            expect(result.data.assignedCategoryId).toBe('gym');
        });

        it('should fail client creation on out-of-boundary currentWeight values', () => {
            const payload = {
                name: 'سارة أحمد',
                email: 'sara@example.com',
                phone: '+201011111111',
                age: 24,
                currentWeight: 10, // weight too low (min 30 in contract)
                targetWeight: 60.0,
                goal: 'خسارة الدهون'
            };
            const result = ClientRequestSchema.safeParse(payload);
            expect(result.success).toBe(false);
        });

        it('should accept null/optional assignedCategoryId relation parameters', () => {
            const payload = {
                name: 'سارة أحمد',
                email: 'sara@example.com',
                phone: '+201011111111',
                age: 24,
                currentWeight: 75.0,
                targetWeight: 68.0,
                goal: 'اللياقة البدنية',
                assignedCategoryId: null
            };
            const result = ClientRequestSchema.safeParse(payload);
            expect(result.success).toBe(true);
            expect(result.data.assignedCategoryId).toBeNull();
        });
    });

    describe('Exercises Contracts', () => {
        it('should validate normal exercise records', () => {
            const payload = {
                name: 'تمارين بطن',
                duration: '15 دقيقة',
                difficulty: 'متوسط',
                participants: 12,
                sets: '3 مجموعات × 15 تكرار',
                image: '🔥'
            };
            const result = ExerciseRequestSchema.safeParse(payload);
            expect(result.success).toBe(true);
        });

        it('should fail exercises verification on undefined required field values', () => {
            const payload = {
                name: 'تمارين بطن',
                difficulty: 'متوسط' // missing duration and sets
            };
            const result = ExerciseRequestSchema.safeParse(payload);
            expect(result.success).toBe(false);
        });
    });

    describe('Nutrition Contracts', () => {
        it('should validate macro target ratios adding to 100%', () => {
            const payload = {
                name: 'برنامج الكيتو الغذائي',
                description: 'نظام الكربوهيدرات المنخفضة',
                duration: '4 أسابيع',
                calories: 1800,
                macros: {
                    protein: { value: 20, color: 'bg-red-500' },
                    carbs: { value: 10, color: 'bg-yellow-500' },
                    fats: { value: 70, color: 'bg-blue-500' }
                },
                meals: [
                    { name: 'فطور كيتو', time: '09:00 ص', calories: 450 }
                ]
            };
            const result = NutritionPlanRequestSchema.safeParse(payload);
            expect(result.success).toBe(true);
        });

        it('should fail nutrition contracts verification when macros sum does not add to 100%', () => {
            const payload = {
                name: 'برنامج الكيتو الغذائي',
                description: 'نظام الكربوهيدرات المنخفضة',
                duration: '4 أسابيع',
                calories: 1800,
                macros: {
                    protein: { value: 20, color: 'bg-red-500' },
                    carbs: { value: 20, color: 'bg-yellow-500' }, // 20 + 20 + 70 = 110% (fails sum check)
                    fats: { value: 70, color: 'bg-blue-500' }
                },
                meals: [
                    { name: 'فطور كيتو', time: '09:00 ص', calories: 450 }
                ]
            };
            const result = NutritionPlanRequestSchema.safeParse(payload);
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('مجموع نسب المغذيات (البروتين، الكربوهيدرات، الدهون) يجب أن يساوي 100%');
        });
    });
});
