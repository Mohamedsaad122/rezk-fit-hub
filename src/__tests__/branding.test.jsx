import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBrandingStore } from '../store/branding.store';

describe('Sprint 5.0 SaaS Branding Engine Test Suite', () => {
    beforeEach(() => {
        // Setup mock DOM elements for browser APIs in Vitest JSDOM
        document.documentElement.style.setProperty = vi.fn();
        
        const head = document.getElementsByTagName('head')[0] || document.createElement('head');
        if (!document.getElementsByTagName('head')[0]) {
            document.appendChild(head);
        }
    });

    it('should set branding config states and update browser DOM variables', () => {
        const settings = {
            companyName: 'نادي الرشاقة الشامل',
            primaryColor: '#ff0000',
            secondaryColor: '#00ff00',
            logo: '/img/logo.png',
            darkLogo: '/img/dark-logo.png',
            favicon: '/img/favicon.ico',
            typography: 'Outfit',
            reportBranding: true,
            invoiceBranding: true
        };

        const store = useBrandingStore.getState();
        
        // Update store state
        store.updateBrandingState(settings);
        expect(useBrandingStore.getState().companyName).toBe('نادي الرشاقة الشامل');
        expect(useBrandingStore.getState().primaryColor).toBe('#ff0000');

        // Verify style variables injection to DOM
        store.applyBrandingToDOM(settings);
        expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--primary', '#ff0000');
        expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--primary-color', '#ff0000');
        expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--secondary-color', '#00ff00');
    });
});
