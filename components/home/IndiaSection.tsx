'use client';

import { useGeolocation } from "@/hooks/useGeolocation";
import OfferCard from "@/components/offers/OfferCard";
import { Offer } from "@/types";

interface IndiaSectionProps {
    offers: Offer[];
}

export function IndiaSection({ offers }: IndiaSectionProps) {
    const { isIndia } = useGeolocation();

    if (!isIndia) return null;

    const indiaOffers = offers
        .filter(offer =>
            offer.name.toLowerCase().includes("chatgpt") ||
            (offer.name.toLowerCase().includes("perplexity") && offer.name.toLowerCase().includes("airtel")) ||
            (offer.name.toLowerCase().includes("gemini") && offer.name.toLowerCase().includes("jio"))
        )
        .slice(0, 3);

    if (indiaOffers.length === 0) return null;

    return (
        <section className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/30">
            <div className="container text-center mb-12 mx-auto">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                        🇮🇳 India-Only Student Offers
                    </h2>
                    <p className="text-muted-foreground mt-2">Exclusive deals for students in India</p>
                </div>
            </div>
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
                    {indiaOffers.map(offer => (
                        <OfferCard key={offer.id} deal={offer} />
                    ))}
                </div>
            </div>
        </section>
    );
}

