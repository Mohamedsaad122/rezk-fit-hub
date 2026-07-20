import { logger } from '@/utils/logger';

/**
 * Calculates Body Mass Index (BMI).
 * Weight must be in kilograms (kg) and Height in centimeters (cm) or meters (m).
 */
export const calculateBMI = (weight, height) => {
    if (!weight || !height || weight <= 0 || height <= 0) return 0;
    
    // Normalize height to meters if centimeters were provided
    const heightInMeters = height > 3 ? height / 100 : height;
    
    try {
        const bmi = weight / (heightInMeters * heightInMeters);
        return parseFloat(bmi.toFixed(2));
    } catch (e) {
        logger.error('Error calculating BMI:', e);
        return 0;
    }
};

/**
 * Returns standard Arabic classification of BMI value.
 */
export const getBMICategoryArabic = (bmi) => {
    if (bmi <= 0) return 'غير معروف';
    if (bmi < 18.5) return 'نقص في الوزن';
    if (bmi < 25) return 'وزن صحي طبيعي';
    if (bmi < 30) return 'زيادة في الوزن';
    return 'سمنة مفرطة';
};

export default calculateBMI;
