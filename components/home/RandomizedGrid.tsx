'use client';

import { useState, useEffect } from 'react';
import { Offer } from '@/types';
import OffersGrid from "@/components/offers/OffersGrid";
import { DeferredRender } from "@/components/utils/DeferredRender";

interface RandomizedGridProps {
    offers: Offer[];
}

export function RandomizedGrid({ offers }: RandomizedGridProps) {
    const [randomizedOffers, setRandomizedOffers] = useState<Offer[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!offers || offers.length === 0) {
                setRandomizedOffers([]);
                return;
            }
            const shuffled = [...offers];
            for (let i = shuffled.length - 1; i > 0; i--) {
                // Use a simple random shuffle for display variety
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            setRandomizedOffers(shuffled.slice(0, 12));
        }, 0);
        return () => clearTimeout(timer);
    }, [offers]);

    if (!offers || offers.length === 0) return null;

    return (
        <section className="py-4 md:py-8">
            <div className="container">
                <DeferredRender minHeight="800px">
                    <OffersGrid offers={randomizedOffers} />
                </DeferredRender>
            </div>
        </section>
    );
}
