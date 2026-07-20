import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../store/auth.store';

import mockDatabase from '../mocks/mockDatabase';

// Reset React Testing Library DOM trees after each test
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

// Configure standard mock environments for DOM matches
beforeEach(() => {
    // Reset database to initial seed defaults
    mockDatabase.reset();

    // Clear localStorage values
    localStorage.clear();
    
    // Reset Zustand store state to defaults
    useAuthStore.getState().clearSession();
});

// Mock matches media query browser functions
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
