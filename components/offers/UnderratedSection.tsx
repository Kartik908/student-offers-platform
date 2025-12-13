import React from 'react';
import OfferCard from "@/components/offers/OfferCard";
import { Offer } from "@/types";

interface UnderratedSectionProps {
    offers: Offer[];
}

export const UnderratedSection = ({ offers }: UnderratedSectionProps) => {
    const underratedOffers = offers.filter(offer => offer.is_underrated);

    if (underratedOffers.length === 0) return null;

    return (
        <section className="py-8 md:py-12 animate-in fade-in duration-700 relative">
            <div className="container text-center mb-12 mx-auto">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                        <svg className="inline-block w-7 h-7 md:w-8 md:h-8 drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] -mt-1 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#star-gradient)" stroke="url(#star-stroke)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <radialGradient id="star-gradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0.9" />
                                    <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="hsl(var(--primary))" />
                                </radialGradient>
                                <linearGradient id="star-stroke" x1="2" y1="2" x2="22" y2="21.02">
                                    <stop stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                                    <stop offset="1" stopColor="hsl(var(--primary))" />
                                </linearGradient>
                            </defs>
                        </svg>
                        Underrated Student Perks
                    </h2>
                    <p className="text-muted-foreground mt-2">Surprisingly valuable perks most students miss</p>
                </div>
            </div>

            <div className="container">
                <div className="relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-r from-primary via-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-cyan-400 opacity-20 blur-xl"></div>
                    <div className="relative rounded-2xl bg-background/95 backdrop-blur-xl p-6 md:p-8 overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-foreground/30">
                        <div className="flex gap-4 md:gap-6 pb-2">
                            {underratedOffers.map(offer => (
                                <div key={offer.id} className="w-[280px] sm:w-[320px] flex-shrink-0">
                                    <OfferCard deal={offer} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
