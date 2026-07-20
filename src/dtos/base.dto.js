/**
 * Base DTO mapper utility helper.
 */
export class BaseDto {
    /**
     * Map a collection of objects to domain models using the provided DTO.
     * @param {Array} list - Array of payloads.
     * @param {class} dtoClass - The DTO class containing a static `toDomain` method.
     */
    static toDomainList(list, dtoClass) {
        if (!Array.isArray(list)) return [];
        return list.map(item => dtoClass.toDomain(item));
    }

    /**
     * Map a collection of objects to requests using the provided DTO.
     * @param {Array} list - Array of domain models.
     * @param {class} dtoClass - The DTO class containing a static `toRequest` method.
     */
    static toRequestList(list, dtoClass) {
        if (!Array.isArray(list)) return [];
        return list.map(item => dtoClass.toRequest(item));
    }

    /**
     * Standard ISO Date normalizer helper.
     * @param {string|Date} val - The input date.
     * @returns {string|null} ISO date string or null.
     */
    static parseDate(val) {
        if (!val) return null;
        try {
            return new Date(val).toISOString();
        } catch {
            return null;
        }
    }
}

export default BaseDto;
