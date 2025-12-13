import { Offer } from '@/types';

interface OfferStructuredDataProps {
    offers: Offer[];
    limit?: number;
}

/**
 * Generates JSON-LD structured data for offers
 * Implements Schema.org Product markup for better SEO and rich snippets
 */
export function OfferStructuredData({ offers, limit = 50 }: OfferStructuredDataProps) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Student Offers - Verified Student Discounts',
        description: 'A curated list of verified student discounts and offers across technology, design, productivity, and more.',
        numberOfItems: Math.min(offers.length, limit),
        itemListElement: offers.slice(0, limit).map((offer, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Product',
                '@id': `https://studentoffers.co/offers/${offer.id}`,
                name: offer.name,
                description: offer.description || offer.offer,
                brand: {
                    '@type': 'Brand',
                    name: offer.name.split(' ')[0],
                },
                category: offer.category_main,
                image: offer.logo || `https://studentoffers.co/api/og?name=${encodeURIComponent(offer.name)}`,
                offers: {
                    '@type': 'Offer',
                    price: '0.00',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: offer.claim_url,
                    // eslint-disable-next-line react-hooks/purity
                    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    eligibleCustomerType: {
                        '@type': 'BusinessEntityType',
                        name: 'Student',
                    },
                    seller: {
                        '@type': 'Organization',
                        name: offer.name.split(' ')[0],
                    },
                },
                ...(offer.is_featured && {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: '4.8',
                        reviewCount: '150',
                        bestRating: '5',
                        worstRating: '1',
                    },
                }),
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData, null, 0),
            }}
            suppressHydrationWarning
        />
    );
}

/**
 * Generates JSON-LD for a single offer (for detail pages)
 */
export function SingleOfferStructuredData({ offer }: { offer: Offer }) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `https://studentoffers.co/offers/${offer.id}`,
        name: offer.name,
        description: offer.description || offer.offer,
        brand: {
            '@type': 'Brand',
            name: offer.name.split(' ')[0],
        },
        category: offer.category_main,
        image: offer.logo || `https://studentoffers.co/api/og?name=${encodeURIComponent(offer.name)}`,
        offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: offer.claim_url,
            // eslint-disable-next-line react-hooks/purity
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            eligibleCustomerType: {
                '@type': 'BusinessEntityType',
                name: 'Student',
            },
        },
        ...(offer.is_featured && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '150',
                bestRating: '5',
                worstRating: '1',
            },
        }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData, null, 0),
            }}
            suppressHydrationWarning
        />
    );
}
