'use client';

import { useEffect } from 'react';
import OfferCard from "@/components/offers/OfferCard";
import { useFavorites } from "@/providers/FavoritesProvider";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Trash2, Lock } from "lucide-react";
import Link from "next/link";

export function FavoritesContent() {
    const { favorites, clearAllFavorites } = useFavorites();

    useEffect(() => {
        document.title = 'My Favorites | Student Offers';
    }, []);

    return (
        <div className="w-full py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header - Polished */}
                <div className="text-center mb-4 sm:mb-5">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
                        Your Favorites {favorites.length > 0 && (
                            <span className="text-muted-foreground font-normal">({favorites.length})</span>
                        )}
                    </h1>

                    {/* Privacy badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 dark:text-emerald-400">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs font-medium">Stored locally, never shared</span>
                    </div>
                </div>

                {favorites.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16 sm:py-20">
                        <div className="max-w-sm mx-auto">
                            <div className="mb-8">
                                <Heart className="w-16 h-16 mx-auto text-primary fill-primary opacity-20" />
                            </div>

                            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                                Save the best for later
                            </h2>

                            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                                See a deal you love? Tap the <Heart className="w-3.5 h-3.5 inline-block mx-0.5 fill-primary/20" /> to keep track of it here.
                            </p>

                            <Link href="/tools">
                                <Button size="lg" className="gap-2 shadow-lg shadow-primary/10 text-primary-foreground">
                                    <Sparkles className="w-4 h-4" />
                                    Browse Offers
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Actions Bar */}
                        <div className="flex items-center justify-between mb-5 pb-3 border-b border-border/50">
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{favorites.length}</span> {favorites.length === 1 ? 'offer' : 'offers'}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFavorites}
                                className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Clear
                            </Button>
                        </div>

                        {/* Offers Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                            {favorites.map((offer) => (
                                <OfferCard key={offer.id} deal={offer} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
