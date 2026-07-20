import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO component for managing html head title, meta and OpenGraph tags dynamically.
 */
export function SEO({ 
    title, 
    description = "نظام التدريب الإلكتروني المتكامل Rezk Fit Hub لإدارة التمارين والأنظمة الغذائية والمتدربين بشكل احترافي.",
    canonicalUrl = "",
    ogType = "website",
    ogImage = "/og-image.jpg"
}) {
    const defaultTitle = "Rezk Fit Hub - نظام التدريب الإلكتروني";
    const fullTitle = title ? `${title} | Rezk Fit Hub` : defaultTitle;
    
    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
            
            {/* OpenGraph metadata */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:image" content={ogImage} />
            
            {/* Twitter Cards metadata */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
}

export default SEO;
