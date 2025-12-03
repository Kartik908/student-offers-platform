import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    keywords?: string;
    image?: string;
    type?: string;
    structuredData?: any;
}

export function SEO({
    title,
    description,
    canonical,
    keywords,
    image = 'https://studentoffers.co/og-image.png?v=2',
    type = 'website',
    structuredData
}: SEOProps) {
    const siteTitle = 'Student Offers';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    const currentUrl = canonical || window.location.href;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@studentoffers" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Theme color for mobile browsers */}
            <meta name="theme-color" content="#3b82f6" />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
}
