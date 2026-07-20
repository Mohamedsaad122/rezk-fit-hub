import { logger } from '@/utils/logger';

/**
 * Calculates basal metabolic rate (BMR) using the Mifflin-St Jeor equation.
 * Height is in centimeters, weight is in kilograms, age is in years.
 * Gender can be 'male' or 'female'.
 */
export const calculateBMR = (weight, height, age, gender = 'male') => {
    if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) return 0;
    
    try {
        if (gender.toLowerCase() === 'female') {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } catch (e) {
        logger.error('Error calculating BMR:', e);
        return 0;
    }
};

/**
 * Calculates TDEE (Total Daily Energy Expenditure) based on activity level.
 * Activity levels: 
 * 'sedentary' (1.2), 'light' (1.375), 'moderate' (1.55), 'active' (1.725), 'extreme' (1.9)
 */
export const calculateTDEE = (bmr, activityLevel = 'moderate') => {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        extreme: 1.9,
    };
    
    const factor = multipliers[activityLevel.toLowerCase()] || 1.2;
    return Math.round(bmr * factor);
};

/**
 * Recommends caloric targets based on trainee goal (e.g. lose, maintain, gain).
 */
export const getCaloricTarget = (tdee, goal = 'maintain') => {
    if (goal === 'lose') {
        return Math.round(tdee - 500); // 500 kcal deficit
    }
    if (goal === 'gain') {
        return Math.round(tdee + 400); // 400 kcal surplus
    }
    return tdee; // Maintenance
};
