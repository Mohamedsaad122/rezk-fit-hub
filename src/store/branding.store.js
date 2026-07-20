import { create } from 'zustand';

export const useBrandingStore = create((set) => ({
    companyName: 'Rezk Fit Hub',
    primaryColor: '#0ea5e9',
    secondaryColor: '#64748b',
    logo: '/logo.png',
    darkLogo: '/logo-dark.png',
    favicon: '/favicon.ico',
    typography: 'Inter',
    reportBranding: true,
    invoiceBranding: true,

    updateBrandingState: (settings) => {
        if (!settings) return;
        set({
            companyName: settings.companyName,
            primaryColor: settings.primaryColor,
            secondaryColor: settings.secondaryColor,
            logo: settings.logo,
            darkLogo: settings.darkLogo,
            favicon: settings.favicon,
            typography: settings.typography,
            reportBranding: !!settings.reportBranding,
            invoiceBranding: !!settings.invoiceBranding
        });
    },

    applyBrandingToDOM: (settings) => {
        if (!settings) return;
        
        // 1. Ingest colors to CSS variables on :root
        const root = document.documentElement;
        if (root) {
            root.style.setProperty('--primary', settings.primaryColor);
            root.style.setProperty('--primary-color', settings.primaryColor);
            root.style.setProperty('--secondary-color', settings.secondaryColor);
            root.style.setProperty('--font-family', settings.typography);
        }

        // 2. Set Favicon
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = settings.favicon;

        // 3. Set Document Typography Font Family import if not default
        let fontStyle = document.getElementById('tenant-dynamic-font');
        if (!fontStyle) {
            fontStyle = document.createElement('style');
            fontStyle.id = 'tenant-dynamic-font';
            document.head.appendChild(fontStyle);
        }
        
        const fontName = settings.typography;
        fontStyle.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap');
            body {
                font-family: '${fontName}', sans-serif !important;
            }
        `;
    }
}));

export default useBrandingStore;
