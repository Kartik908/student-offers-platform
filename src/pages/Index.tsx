import { useMemo } from "react";
import GithubPackBanner from "@/components/promo/GithubPackBanner";
import OffersGrid from "@/components/offers/OffersGrid";
import OfferCard from "@/components/offers/OfferCard";
import { useOffers } from "@/hooks/useOffers";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Skeleton } from "@/components/ui/skeleton";
import HighlightsRail from "@/components/highlights/HighlightsRail";
import { Hero } from "@/components/hero/Hero";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { SubmitCTA } from "@/components/promo/SubmitCTA";
import { generateCategoriesFromOffers, getCategoryCounts } from "@/lib/categoryUtils";
import { useStudentEligibilityToast } from "@/hooks/useStudentEligibilityToast";
import { UnderratedSection } from "@/components/offers/UnderratedSection";

import { SEO } from "@/components/seo/SEO";

const Index = () => {
  const { data: offers, isLoading, error } = useOffers();
  const { isIndia } = useGeolocation();

  // Show student eligibility toast for first-time users
  useStudentEligibilityToast();

  const githubPackOffers = offers?.filter(d => d.github_offer) || [];
  const hiddenGemsOffers = offers?.filter(d => d.is_hidden_gem) || [];
  const featuredOffers = offers?.filter(d => d.is_featured) || [];

  // Generate categories dynamically from offers
  const categories = useMemo(() => {
    if (!offers) return [];
    return generateCategoriesFromOffers(offers);
  }, [offers]);

  const categoryCounts = useMemo(() => {
    if (!offers || !categories) return {};
    return getCategoryCounts(offers, categories);
  }, [offers, categories]);

  // Randomize offers for "Explore All Offers" section - shuffles on each page load
  const randomizedOffers = useMemo(() => {
    if (!offers) return [];

    // Fisher-Yates shuffle algorithm
    const shuffled = [...offers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 12);
  }, [offers]);

  // Only show loading state if we have no data at all
  const showLoadingState = isLoading && !offers;

  // Generate structured data for the list of offers
  const structuredData = useMemo(() => {
    if (!offers) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": offers.slice(0, 20).map((offer, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": offer.name,
          "description": offer.description,
          "url": offer.claim_url,
          "image": offer.logo || "https://studentoffers.co/og-image.png",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    };
  }, [offers]);

  return (
    <main className="flex flex-col">
      <SEO
        title="Student Offers"
        description="The #1 curated student discount directory. Access $5k+ in verified offers for GitHub, Notion, Adobe & Spotify. Legit 2025 deals without the spam."
        canonical="https://studentoffers.co/"
        structuredData={structuredData}
      />
      <Hero offerCount={offers?.length || 180} />

      <CategoryGrid categories={categories} categoryCounts={categoryCounts} />

      <section className="py-8 md:py-12">
        <GithubPackBanner />
      </section>

      {showLoadingState && (
        <div className="container py-4 md:py-8">
          <Skeleton className="h-8 w-64 mb-4 mx-auto" />
          <Skeleton className="h-10 w-80 mb-8 mx-auto" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-72 rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>
      )}

      {error && !offers && (
        <div className="text-destructive text-center py-4 md:py-8" role="alert">
          Failed to load offers: {error.message}
        </div>
      )}

      {offers && (
        <HighlightsRail
          githubOffers={githubPackOffers}
          hiddenGemsOffers={hiddenGemsOffers}
          featuredOffers={featuredOffers.slice(0, 10)}
        />
      )}

      {/* India Exclusive Offers Section - Only show for India visitors */}
      {offers && isIndia && (
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
              {offers
                .filter(offer =>
                  offer.name.toLowerCase().includes("chatgpt") ||
                  (offer.name.toLowerCase().includes("perplexity") && offer.name.toLowerCase().includes("airtel")) ||
                  (offer.name.toLowerCase().includes("gemini") && offer.name.toLowerCase().includes("jio"))
                )
                .slice(0, 3)
                .map(offer => (
                  <OfferCard key={offer.id} deal={offer} />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Underrated Offers Section */}
      {offers && (
        <UnderratedSection offers={offers} />
      )}

      <section className="py-4 md:py-8">
        <div className="container">
          {showLoadingState ? (
            <div>
              <Skeleton className="h-10 w-1/2 mb-2" />
              <Skeleton className="h-6 w-3/4 mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ) : offers && offers.length > 0 ? (
            <OffersGrid offers={randomizedOffers} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No offers available</p>
            </div>
          )}
        </div>
      </section>

      <SubmitCTA />


    </main>
  );
};

export default Index;